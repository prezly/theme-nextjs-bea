import * as Sentry from '@sentry/nextjs';

import { replaceEnvHeaderWithNewsroomTag } from './src/telemetry/sentry';

export async function register() {
    // Next.js runs this once per server runtime (Node.js and Edge), and it is
    // the only place Sentry can be initialised for either of them.
    await import('./sentry.server.config');
    Sentry.getClient()?.addEventProcessor(replaceEnvHeaderWithNewsroomTag);

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
