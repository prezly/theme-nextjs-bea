import { once } from 'node:events';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { expect, test } from '@playwright/test';

// The guard is plain Node so it runs before Next.js is loaded.
import { createFlightGuard, inspectFlight, listen } from '../server/flight-guard.mjs';

const HEALTHY = [
    '1:"$Sreact.fragment"',
    '2:I[56925,[],""]',
    '0:{"b":"c74HBVuzckBUQfIcyg0d7","f":[["",{"children":["__PAGE__",{}]}],["",["$","$1","c",{"children":null}]]]}',
    '',
].join('\n');

// A text row is length-prefixed in bytes and may contain anything, including
// something that looks like an error row on its own line.
const WITH_TEXT_ROW = `${'3:T1e,'}${'story body\n9:E{"digest":"x"}'.padEnd(30, ' ')}${HEALTHY}`;
const WITH_ERROR = `${HEALTHY}4:E{"digest":"4248135441"}\n`;

function port(server: Server) {
    return (server.address() as AddressInfo).port;
}

async function close(server: Server) {
    const closed = once(server, 'close');
    server.closeAllConnections();
    server.close();
    await closed;
}

type Upstream = (
    req: import('node:http').IncomingMessage,
    res: import('node:http').ServerResponse,
) => void;

async function guarded(handler: Upstream, options: { maxBytes?: number } = {}) {
    const upstream = createServer(handler);
    await listen(upstream, 0, '127.0.0.1');
    const logs: unknown[] = [];
    const guard = createFlightGuard({
        upstreamPort: port(upstream),
        log: (e: unknown) => logs.push(e),
        ...options,
    });
    await listen(guard, 0, '127.0.0.1');
    return {
        logs,
        url: `http://127.0.0.1:${port(guard)}`,
        async stop() {
            await close(guard);
            await close(upstream);
        },
    };
}

test.describe('inspectFlight', () => {
    test('accepts a complete payload and rejects error, truncated and empty ones', () => {
        expect(inspectFlight(Buffer.from(HEALTHY))).toMatchObject({
            complete: true,
            errors: [],
            rows: 3,
        });
        expect(inspectFlight(Buffer.from(WITH_ERROR))).toMatchObject({
            complete: false,
            reason: 'error_row',
            errors: ['4248135441'],
        });
        expect(inspectFlight(Buffer.from(HEALTHY.slice(0, -5)))).toMatchObject({
            complete: false,
            reason: 'truncated_row',
        });
        expect(inspectFlight(Buffer.alloc(0))).toMatchObject({ complete: false, reason: 'empty' });
        expect(inspectFlight(Buffer.from('zz:1\n'))).toMatchObject({
            complete: false,
            reason: 'invalid_row_id',
        });
        expect(inspectFlight(Buffer.from('not flight at all\n'))).toMatchObject({
            complete: false,
            reason: 'unterminated_row_id',
        });
    });

    test('treats binary rows as byte-counted too, so an error row inside them is not hidden', () => {
        // A typed-array row followed by an error row; a newline scanner would skip the error.
        const binary = `3:A8,${'\x00'.repeat(8)}4:E{"digest":"boom"}\n${HEALTHY}`;
        expect(inspectFlight(Buffer.from(binary, 'latin1'))).toMatchObject({
            complete: false,
            reason: 'error_row',
            errors: ['boom'],
        });
        // Binary content that contains a newline must not be split into rows.
        const withNewline = `5:o3,\n\n\n${HEALTHY}`;
        expect(inspectFlight(Buffer.from(withNewline, 'latin1'))).toMatchObject({
            complete: true,
            rows: 4,
        });
    });

    test('rejects a payload that references rows which never arrived', () => {
        const cut =
            '0:{"f":[["",{"children":"$L3"}]],"p":"$@4","x":"$2:props"}\n1:"$Sreact.fragment"\n2:I[1,[],""]\n';
        expect(inspectFlight(Buffer.from(cut))).toMatchObject({
            complete: false,
            reason: 'missing_row',
            missing: ['3', '4'],
        });
        const whole = `${cut}3:["$","div",null,{}]\n4:{"ok":true}\n`;
        expect(inspectFlight(Buffer.from(whole))).toMatchObject({ complete: true, rows: 5 });
        // Escaped literals and non-row references are not row ids.
        const literals =
            '0:["$$3","$Sreact.suspense","$D2026-09-17T00:00:00.000Z","$n12","$undefined","$-0"]\n';
        expect(inspectFlight(Buffer.from(literals))).toMatchObject({ complete: true, rows: 1 });
    });

    test('counts text rows by byte length so their content is never read as rows', () => {
        expect(inspectFlight(Buffer.from(WITH_TEXT_ROW))).toMatchObject({
            complete: true,
            errors: [],
            rows: 4,
        });
        const unicode = `5:T${Buffer.byteLength('héllo').toString(16)},héllo${HEALTHY}`;
        expect(inspectFlight(Buffer.from(unicode))).toMatchObject({ complete: true, rows: 4 });
        expect(inspectFlight(Buffer.from('5:Tff,short'))).toMatchObject({
            complete: false,
            reason: 'truncated_row',
        });
    });
});

test.describe('flight guard', () => {
    test('marks a complete Flight response and strips markers the upstream sent', async () => {
        const seen: Record<string, string | string[] | undefined> = {};
        const server = await guarded((req, res) => {
            seen['accept-encoding'] = req.headers['accept-encoding'];
            seen['x-prezly-render'] = req.headers['x-prezly-render'];
            res.writeHead(200, {
                'content-type': 'text/x-component',
                'x-prezly-render': 'complete',
                vary: 'rsc, next-router-state-tree',
                'cache-control': 'private, no-cache, no-store, max-age=0, must-revalidate',
            });
            res.write(HEALTHY.slice(0, 10));
            setTimeout(() => res.end(HEALTHY.slice(10)), 20);
        });
        try {
            const response = await fetch(`${server.url}/en?_rsc=abc`, {
                headers: { rsc: '1', 'accept-encoding': 'gzip', 'x-prezly-render': 'complete' },
            });
            expect(response.status).toBe(200);
            expect(response.headers.get('x-prezly-render')).toBe('complete');
            expect(response.headers.get('content-length')).toBe(String(Buffer.byteLength(HEALTHY)));
            expect(response.headers.get('vary')).toBe('rsc, next-router-state-tree');
            expect(await response.text()).toBe(HEALTHY);
            expect(seen['accept-encoding']).toBeUndefined();
            expect(seen['x-prezly-render']).toBeUndefined();
            expect(server.logs).toEqual([]);
        } finally {
            await server.stop();
        }
    });

    test('never marks a 200 whose stream carries an error row, and logs the digest', async () => {
        const server = await guarded((_req, res) => {
            res.writeHead(200, { 'content-type': 'text/x-component' });
            res.write(HEALTHY);
            setTimeout(() => res.end('4:E{"digest":"4248135441"}\n'), 20);
        });
        try {
            const response = await fetch(`${server.url}/en`, { headers: { rsc: '1' } });
            expect(response.status).toBe(200);
            expect(response.headers.get('x-prezly-render')).toBe('error_row');
            expect(await response.text()).toBe(WITH_ERROR);
            expect(server.logs).toEqual([
                expect.objectContaining({
                    msg: 'flight_guard_incomplete',
                    reason: 'error_row',
                    errors: ['4248135441'],
                }),
            ]);
        } finally {
            await server.stop();
        }
    });

    test('answers 502 when Next.js drops the connection mid-stream', async () => {
        const server = await guarded((_req, res) => {
            res.writeHead(200, { 'content-type': 'text/x-component' });
            res.write(HEALTHY.slice(0, 20));
            setTimeout(() => res.destroy(), 20);
        });
        try {
            const response = await fetch(`${server.url}/en`, { headers: { rsc: '1' } });
            expect(response.status).toBe(502);
            expect(response.headers.get('x-prezly-render')).toBe('truncated');
            expect(server.logs).toEqual([
                expect.objectContaining({ msg: 'flight_guard_truncated' }),
            ]);
        } finally {
            await server.stop();
        }
    });

    test('forwards an oversized payload in full without a marker', async () => {
        const big = `6:T${(200).toString(16)},${'x'.repeat(200)}${HEALTHY}`;
        const server = await guarded(
            (_req, res) => {
                res.writeHead(200, { 'content-type': 'text/x-component' });
                res.write(big.slice(0, 100));
                setTimeout(() => res.end(big.slice(100)), 20);
            },
            { maxBytes: 64 },
        );
        try {
            const response = await fetch(`${server.url}/en`, { headers: { rsc: '1' } });
            expect(response.status).toBe(200);
            expect(response.headers.get('x-prezly-render')).toBe('oversize');
            expect(response.headers.get('content-length')).toBeNull();
            expect(await response.text()).toBe(big);
            expect(server.logs).toEqual([
                expect.objectContaining({ msg: 'flight_guard_oversize' }),
            ]);
        } finally {
            await server.stop();
        }
    });

    test('streams non-200 Flight responses through without any marker', async () => {
        const server = await guarded((req, res) => {
            res.writeHead(req.url === '/missing' ? 404 : 304, {
                'content-type': 'text/x-component',
                'x-prezly-render': 'complete',
            });
            res.end(req.url === '/missing' ? HEALTHY : undefined);
        });
        try {
            const missing = await fetch(`${server.url}/missing`, { headers: { rsc: '1' } });
            expect(missing.status).toBe(404);
            expect(missing.headers.get('x-prezly-render')).toBeNull();
            expect(await missing.text()).toBe(HEALTHY);
            const revalidated = await fetch(`${server.url}/fresh`, { headers: { rsc: '1' } });
            expect(revalidated.status).toBe(304);
            expect(revalidated.headers.get('x-prezly-render')).toBeNull();
        } finally {
            await server.stop();
        }
    });

    test('aborts the upstream request when the client leaves mid-stream', async () => {
        let upstreamClosed = false;
        let upstreamRequest: import('node:http').IncomingMessage | undefined;
        const server = await guarded((req, res) => {
            upstreamRequest = req;
            res.writeHead(200, { 'content-type': 'text/html' });
            res.write('<html>');
            res.on('close', () => {
                upstreamClosed = true;
            });
            // Never ends: the client has to be the one to give up.
        });
        try {
            const controller = new AbortController();
            const response = await fetch(`${server.url}/slow`, { signal: controller.signal });
            expect(response.status).toBe(200);
            controller.abort();
            await expect(response.text()).rejects.toThrow();
            for (let i = 0; i < 50 && !upstreamClosed; i += 1)
                await new Promise((r) => setTimeout(r, 20));
            expect(upstreamClosed).toBe(true);
            expect(upstreamRequest?.destroyed).toBe(true);
        } finally {
            await server.stop();
        }
    });

    test('ends the client response when Next.js drops a streamed HTML response', async () => {
        const server = await guarded((_req, res) => {
            res.writeHead(200, { 'content-type': 'text/html' });
            res.write('<html>');
            setTimeout(() => res.destroy(), 20);
        });
        try {
            const response = await fetch(`${server.url}/en`);
            expect(response.status).toBe(200);
            await expect(response.text()).rejects.toThrow();
        } finally {
            await server.stop();
        }
    });

    test('streams HTML, non-Flight and HEAD responses through untouched', async () => {
        const server = await guarded((req, res) => {
            res.writeHead(200, {
                'content-type': req.headers.rsc ? 'text/x-component' : 'text/html',
                'x-prezly-render': 'complete',
            });
            if (req.method === 'HEAD') return res.end();
            res.write('<html>');
            setTimeout(() => res.end('</html>'), 20);
        });
        try {
            const html = await fetch(`${server.url}/en`, {
                headers: { 'accept-encoding': 'gzip' },
            });
            expect(html.headers.get('x-prezly-render')).toBeNull();
            expect(html.headers.get('transfer-encoding')).toBe('chunked');
            expect(await html.text()).toBe('<html></html>');
            const head = await fetch(`${server.url}/en`, { method: 'HEAD', headers: { rsc: '1' } });
            expect(head.status).toBe(200);
            expect(head.headers.get('x-prezly-render')).toBeNull();
            expect(server.logs).toEqual([]);
        } finally {
            await server.stop();
        }
    });

    test('answers 502 when Next.js is not listening', async () => {
        const guard = createFlightGuard({ upstreamPort: 1, log: () => {} });
        await listen(guard, 0, '127.0.0.1');
        try {
            const response = await fetch(`http://127.0.0.1:${port(guard)}/en`, {
                headers: { rsc: '1' },
            });
            expect(response.status).toBe(502);
            expect(response.headers.get('x-prezly-render')).toBe('upstream_unavailable');
        } finally {
            await close(guard);
        }
    });
});
