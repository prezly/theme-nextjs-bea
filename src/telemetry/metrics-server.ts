import { createServer, type Server } from 'node:http';
import { ContentDelivery } from '@prezly/theme-kit-nextjs';

type Collector = Pick<
    ReturnType<typeof ContentDelivery.getMetricsCollector>,
    'render' | 'contentType'
>;

const SERVER = Symbol.for('prezly.bea.metrics.server.v1');
const globals = globalThis as typeof globalThis & {
    [SERVER]?: Promise<Server | undefined>;
};

/** A dedicated listener: this endpoint is never registered in the Next.js router. */
export function listenMetricsServer(
    port: number,
    host: string,
    collector: Collector = ContentDelivery.getMetricsCollector('node'),
): Promise<Server | undefined> {
    return new Promise((resolve) => {
        const server = createServer({ maxHeaderSize: 8192 }, (request, response) => {
            response.setHeader('Cache-Control', 'no-store');
            if (request.url !== '/metrics') {
                response.writeHead(404).end();
                return;
            }
            if (request.method !== 'GET' && request.method !== 'HEAD') {
                response.setHeader('Allow', 'GET, HEAD');
                response.writeHead(405).end();
                return;
            }
            try {
                const body = collector.render();
                response.setHeader('Content-Type', collector.contentType);
                response.setHeader('Content-Length', Buffer.byteLength(body));
                response.writeHead(200).end(request.method === 'HEAD' ? undefined : body);
            } catch {
                // Do not disclose exception details or affect application requests.
                response.writeHead(500).end();
            }
        });
        server.maxConnections = 16;
        server.maxRequestsPerSocket = 100;
        server.headersTimeout = 5000;
        server.requestTimeout = 5000;
        server.keepAliveTimeout = 1000;
        server.setTimeout(5000);
        server.on('timeout', (socket) => socket.destroy());
        server.on('error', () => {
            console.warn('[bea-metrics] Exporter listener failed');
            resolve(undefined);
        });
        server.listen(port, host, () => {
            server.unref();
            resolve(server);
        });
    });
}

export function startMetricsServer(): Promise<Server | undefined> {
    if (process.env.BEA_METRICS_ENABLED !== 'true') return Promise.resolve(undefined);
    if (globals[SERVER]) return globals[SERVER];

    const configuredPort = process.env.BEA_METRICS_PORT ?? '9464';
    const port = Number(configuredPort);
    if (!/^\d+$/.test(configuredPort) || port < 1 || port > 65535) {
        console.warn('[bea-metrics] Invalid exporter port');
        return Promise.resolve(undefined);
    }
    globals[SERVER] = listenMetricsServer(port, '0.0.0.0');
    return globals[SERVER];
}
