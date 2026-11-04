export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.BEA_METRICS_ENABLED === 'true') {
        try {
            const { startMetricsServer } = await import('./src/telemetry/metrics-server');
            await startMetricsServer();
        } catch {
            // Observability must not prevent the newsroom server from starting.
            console.warn('[bea-metrics] Exporter initialization failed');
        }
    }
}

// Next.js calls this for every unhandled server error during rendering,
// route handlers and middleware, after the response may already be streaming.
export { onRequestError } from './src/telemetry/render-errors';
