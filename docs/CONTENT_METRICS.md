# Node content metrics

Bea uses the verified Theme Kit 10.11.0 artifacts. Set `BEA_METRICS_ENABLED=true` at runtime to attach its bounded observer to Node adapters and start a separate HTTP listener on port 9464 (`BEA_METRICS_PORT` can override it). The feature is disabled by default. No newsroom request header controls these settings.

The listener serves GET/HEAD `/metrics` with `Cache-Control: no-store`. It is not a Next.js route. The paired GitOps PR provides a dedicated ClusterIP Service and ServiceMonitor; the existing public Service keeps its application port only. The endpoint has no authentication, so cluster-internal connectivity is its access boundary. Production network-policy enforcement is currently disabled; access is not restricted exclusively to Prometheus. Listener initialization, bind and rendering errors cannot fail a page request or application readiness. A bind failure is logged once and retried only after process restart.

Metrics aggregate across all newsrooms handled by a pod. Labels contain only fixed operation, source, layer, outcome and runtime buckets. They do not contain newsroom IDs, hostnames, tokens, request URLs or cache keys. They reset on process restart; use `rate`/`increase` rather than subtracting raw totals across deployments.

Only Node requests are observed. Edge middleware has a separate realm and is deliberately excluded, so these numbers do not represent all API work performed by the newsroom. A zero Redis command count does not prove Redis is healthy or configured. Origin-method counts and upstream HTTP counts have different meanings; see Theme Kit's content telemetry documentation.

## Validation and rollout

Run `pnpm typecheck`, `pnpm check`, and the local Playwright fixture suites, including `tests/metricsServer.spec.ts`. Then run `pnpm build` and `node scripts/test-metrics-exporter.mjs`. The production smoke starts real Next servers using loopback-only API fixtures and checks enabled, disabled, occupied-port and invalid-port startup. It verifies that actual API requests increment the exported collector, a second request hits memory, and exporter failure does not change the API result.

Deploy the Bea image first with the feature disabled. Merge the paired GitOps enablement afterward, then verify each pod's Prometheus target is UP and inspect counter increases under known requests. Do not treat a successful scrape alone as proof that a runtime's requests reach its collector. This change does not yet add a dashboard, alerts or a production load test.
