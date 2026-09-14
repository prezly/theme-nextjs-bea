import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { setTimeout as delay } from 'node:timers/promises';

// Run after pnpm build. All requests go to loopback fixtures, never production.
async function listen(server, host = '127.0.0.1') {
    server.listen(0, host);
    await once(server, 'listening');
    return server.address().port;
}

async function close(server) {
    const closed = once(server, 'close');
    server.close();
    server.closeAllConnections();
    await closed;
}

async function request(url) {
    return fetch(url, { signal: AbortSignal.timeout(3000) });
}

let upstreamRequests = 0;
const upstream = createServer((_req, res) => {
    upstreamRequests += 1;
    res.setHeader('Content-Type', 'application/json');
    res.end(
        JSON.stringify({
            stories: [],
            pagination: { offset: 0, limit: 1, matched_records_number: 0 },
        }),
    );
});
const upstreamPort = await listen(upstream);

function count(body, name, labels = []) {
    return body
        .split('\n')
        .filter(
            (line) => line.startsWith(`${name}{`) && labels.every((label) => line.includes(label)),
        )
        .reduce((sum, line) => sum + Number(line.slice(line.lastIndexOf(' ') + 1)), 0);
}

try {
    for (const mode of ['enabled', 'disabled', 'occupied', 'invalid']) {
        const appReservation = createServer();
        const metricsReservation = createServer((_req, res) => res.end('fixture blocker'));
        const appPort = await listen(appReservation);
        // Occupy the exporter's exact bind address; macOS can allow a separate
        // wildcard listener when only the loopback address is reserved.
        const metricsPort = await listen(metricsReservation, '0.0.0.0');
        await close(appReservation);
        if (mode !== 'occupied') await close(metricsReservation);
        const appUrl = `http://127.0.0.1:${appPort}`;
        const metricsUrl = `http://127.0.0.1:${metricsPort}/metrics`;
        let output = '';
        const child = spawn(
            process.execPath,
            [
                'node_modules/next/dist/bin/next',
                'start',
                '--hostname',
                '127.0.0.1',
                '--port',
                String(appPort),
            ],
            {
                env: {
                    ...process.env,
                    NODE_ENV: 'production',
                    NODE_OPTIONS: '-r next-logger',
                    NEXT_TELEMETRY_DISABLED: '1',
                    SENTRY_DSN: '',
                    NEXT_PUBLIC_SENTRY_DSN: '',
                    REDIS_CACHE_URL: '',
                    PREZLY_ACCESS_TOKEN: 'fixture-token',
                    PREZLY_NEWSROOM_UUID: 'fixture-newsroom',
                    PREZLY_API_BASEURL: `http://127.0.0.1:${upstreamPort}`,
                    BEA_METRICS_ENABLED: mode === 'disabled' ? 'false' : 'true',
                    BEA_METRICS_PORT: mode === 'invalid' ? 'invalid' : String(metricsPort),
                },
                stdio: ['ignore', 'pipe', 'pipe'],
            },
        );
        child.stdout.on('data', (data) => {
            output = (output + data).slice(-12000);
        });
        child.stderr.on('data', (data) => {
            output = (output + data).slice(-12000);
        });
        try {
            let ready = false;
            for (let attempt = 0; attempt < 100; attempt += 1) {
                if (child.exitCode !== null) throw new Error(`Next exited: ${output}`);
                try {
                    const response = await request(`${appUrl}/api/metrics`);
                    assert.equal(response.status, 404);
                    assert.equal(await response.text(), '404 Not Found');
                    ready = true;
                    break;
                } catch {
                    await delay(100);
                }
            }
            assert(ready, `Next did not become ready: ${output}`);
            upstreamRequests = 0;
            for (let i = 0; i < 2; i += 1) {
                const response = await request(`${appUrl}/api/stories?limit=1`);
                assert.equal(response.status, 200, output);
                assert.deepEqual(await response.json(), { data: [], total: 0 });
            }
            assert.equal(upstreamRequests, 1, 'second content request should hit memory');
            if (mode === 'enabled') {
                const response = await request(metricsUrl);
                assert.equal(response.status, 200);
                assert.equal(response.headers.get('cache-control'), 'no-store');
                const body = await response.text();
                assert.equal(
                    count(body, 'theme_kit_content_requests_total', ['operation="stories"']),
                    2,
                );
                assert.equal(
                    count(body, 'theme_kit_content_cache_hits_total', [
                        'operation="stories"',
                        'layer="memory"',
                    ]),
                    1,
                );
                assert.equal(count(body, 'theme_kit_upstream_requests_total'), 1);
                assert(!body.includes('runtime="edge"'));
                assert(!body.includes('fixture-token') && !body.includes('fixture-newsroom'));
            } else if (mode === 'occupied') {
                assert.equal(await (await request(metricsUrl)).text(), 'fixture blocker');
                assert(output.includes('[bea-metrics] Exporter listener failed'), output);
            } else {
                await assert.rejects(request(metricsUrl));
                if (mode === 'invalid')
                    assert(output.includes('[bea-metrics] Invalid exporter port'), output);
            }
            console.log(`${mode}: production request/cache behavior and exporter boundary passed`);
        } finally {
            if (child.exitCode === null) {
                const exited = once(child, 'exit');
                child.kill('SIGTERM');
                const deadline = setTimeout(() => child.kill('SIGKILL'), 5000);
                await exited;
                clearTimeout(deadline);
            }
            if (mode === 'occupied') await close(metricsReservation);
        }
    }
} finally {
    await close(upstream);
}
