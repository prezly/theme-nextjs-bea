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
