import { spawn } from 'node:child_process';

import { createFlightGuard, listen, waitForUpstream } from './flight-guard.mjs';

/**
 * Production entrypoint: Next.js on an internal port, the Flight guard on the
 * public one. The guard only starts listening once Next.js accepts
 * connections, so the TCP readiness probe on the public port keeps its meaning.
 */
const PORT = Number(process.env.PORT ?? 3000);
const UPSTREAM_PORT = Number(process.env.NEXT_UPSTREAM_PORT ?? 3001);
const MAX_BYTES = Number(process.env.FLIGHT_GUARD_MAX_BYTES ?? 2 * 1024 * 1024);

// Next.js keeps its default bind address, as under `next start`, so its
// middleware rewrite handling is unchanged; only the port moves. The
// container exposes the guard's port alone.
const next = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '--port', String(UPSTREAM_PORT)],
    { stdio: 'inherit', env: process.env },
);

let shuttingDown = false;
function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    next.kill(signal);
}
for (const signal of ['SIGTERM', 'SIGINT']) {
    process.on(signal, () => shutdown(signal));
}
next.on('exit', (code, signal) => {
    console.log(JSON.stringify({ msg: 'next_exited', code, signal }));
    process.exit(code ?? 1);
});

try {
    await waitForUpstream({ port: UPSTREAM_PORT });
    const guard = createFlightGuard({ upstreamPort: UPSTREAM_PORT, maxBytes: MAX_BYTES });
    // Above the 60 s idle timeout of the Varnish backend connections.
    guard.keepAliveTimeout = 65_000;
    guard.headersTimeout = 70_000;
    await listen(guard, PORT, '0.0.0.0');
    console.log(
        JSON.stringify({ msg: 'flight_guard_listening', port: PORT, upstream: UPSTREAM_PORT }),
    );
} catch (error) {
    console.error(JSON.stringify({ msg: 'flight_guard_failed', error: error.message }));
    shutdown('SIGTERM');
    process.exit(1);
}
