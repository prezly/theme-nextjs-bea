import { spawn } from 'node:child_process';
import { once } from 'node:events';

import { createFlightGuard, listen, waitForUpstream } from './flight-guard.mjs';

/**
 * Production entrypoint: Next.js on an internal port, the Flight guard on the
 * public one. The guard only starts listening once Next.js accepts
 * connections, so the TCP readiness probe on the public port keeps its meaning.
 */
const PORT = Number(process.env.PORT ?? 3000);
const UPSTREAM_PORT = Number(process.env.NEXT_UPSTREAM_PORT ?? 3001);
const MAX_BYTES = Number(process.env.FLIGHT_GUARD_MAX_BYTES ?? 2 * 1024 * 1024);
/** How long in-flight responses may finish after SIGTERM before Next.js is told to stop. */
const DRAIN_TIMEOUT = Number(process.env.FLIGHT_GUARD_DRAIN_TIMEOUT ?? 15_000);

// Next.js keeps its default bind address, as under `next start`, so its
// middleware rewrite handling is unchanged; only the port moves. The
// container exposes the guard's port alone.
const next = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '--port', String(UPSTREAM_PORT)],
    { stdio: 'inherit', env: process.env },
);

let guard;
let shuttingDown = false;
async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    if (guard) {
        // Stop accepting, let in-flight responses finish, then stop Next.js.
        // Kubernetes removes the pod from the Service in parallel, so the
        // Deployment's preStop hook gives that removal a head start.
        guard.close();
        // A keep-alive connection turns idle only after its response ends, so
        // keep sweeping until the last one is gone or the drain deadline hits.
        const sweep = setInterval(() => guard.closeIdleConnections(), 100);
        const deadline = setTimeout(() => guard.closeAllConnections(), DRAIN_TIMEOUT);
        await once(guard, 'close');
        clearInterval(sweep);
        clearTimeout(deadline);
    }
    next.kill(signal);
}
for (const signal of ['SIGTERM', 'SIGINT']) {
    process.on(signal, () => void shutdown(signal));
}
next.on('exit', (code, signal) => {
    console.log({ msg: 'next_exited', code, signal });
    process.exit(code ?? 1);
});

try {
    await waitForUpstream({ port: UPSTREAM_PORT });
    guard = createFlightGuard({ upstreamPort: UPSTREAM_PORT, maxBytes: MAX_BYTES });
    // Above the 60 s idle timeout of the Varnish backend connections.
    guard.keepAliveTimeout = 65_000;
    guard.headersTimeout = 70_000;
    await listen(guard, PORT, '0.0.0.0');
    console.log({ msg: 'flight_guard_listening', port: PORT, upstream: UPSTREAM_PORT });
} catch (error) {
    console.error({ msg: 'flight_guard_failed', error: error.message });
    next.kill('SIGTERM');
    process.exit(1);
}
