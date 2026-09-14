import { once } from 'node:events';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { expect, test } from '@playwright/test';
import { ContentDelivery } from '@prezly/theme-kit-nextjs';

import { listenMetricsServer } from '../src/telemetry/metrics-server';

function address(server: Server) {
    return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

async function close(server: Server) {
    const closed = once(server, 'close');
    server.close();
    server.closeAllConnections();
    await closed;
}

test('serves the shared collector and restricts endpoint methods and paths', async () => {
    const collector = ContentDelivery.createMetricsCollector({ runtime: 'node' });
    const server = await listenMetricsServer(0, '127.0.0.1', collector);
    expect(server).toBeDefined();
    if (!server) throw new Error('Fixture listener unavailable');
    try {
        collector.observe({
            type: 'cache_hit',
            source: 'prezly',
            operation: 'story',
            layer: 'memory',
        });
        const response = await fetch(`${address(server)}/metrics`);
        const body = await response.text();
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toBe(collector.contentType);
        expect(response.headers.get('cache-control')).toBe('no-store');
        expect(body).toBe(collector.render());
        expect(body).toContain('layer="memory"');
        expect(body).not.toContain('runtime="edge"');
        expect(await (await fetch(`${address(server)}/metrics`, { method: 'HEAD' })).text()).toBe(
            '',
        );
        const post = await fetch(`${address(server)}/metrics`, { method: 'POST' });
        expect(post.status).toBe(405);
        expect(post.headers.get('allow')).toBe('GET, HEAD');
        for (const path of ['/', '/api/stories', '/metrics?token=fixture']) {
            expect((await fetch(`${address(server)}${path}`)).status).toBe(404);
        }
    } finally {
        await close(server);
    }
});

test('a rendering failure returns an empty error and does not kill the listener', async () => {
    let fail = true;
    const server = await listenMetricsServer(0, '127.0.0.1', {
        contentType: 'text/plain',
        render() {
            if (fail) throw new Error('sensitive fixture details');
            return '# recovered\n';
        },
    });
    if (!server) throw new Error('Fixture listener unavailable');
    try {
        const response = await fetch(`${address(server)}/metrics`);
        expect(response.status).toBe(500);
        expect(await response.text()).toBe('');
        fail = false;
        expect((await fetch(`${address(server)}/metrics`)).status).toBe(200);
    } finally {
        await close(server);
    }
});

test('a port conflict resolves without throwing or closing the existing listener', async () => {
    const server = await listenMetricsServer(0, '127.0.0.1');
    if (!server) throw new Error('Fixture listener unavailable');
    try {
        expect(
            await listenMetricsServer((server.address() as AddressInfo).port, '127.0.0.1'),
        ).toBeUndefined();
        expect((await fetch(`${address(server)}/metrics`)).status).toBe(200);
    } finally {
        await close(server);
    }
});
