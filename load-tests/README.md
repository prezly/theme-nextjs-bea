# Local newsroom load testing

This program has two parts because a real browser and a high-rate HTTP generator answer different questions.

1. Chromium crawls the newsroom, follows internal links, loads images, CSS, JavaScript, fonts, and third-party resources, and exercises Next.js client navigation so RSC requests appear in the capture.
2. k6 replays the captured page mix at increasing concurrency. It records `X-Prezly-Cache` or `X-Cache` on every request and writes raw metric points for later analysis.

Run this against the production-mode local stack. Development mode compiles routes on demand and gives misleading capacity numbers.

## First run

```sh
scripts/bea-env up --production
scripts/load-test audit \
  --target https://t3code-9b280e28.bea.app.homer.prezly.dev \
  --max-pages 50 \
  --max-depth 3
scripts/load-test run smoke
scripts/load-test analyze
```

The audit writes `load-tests/artifacts/browser-audit.json`. It clears Chromium's browser cache before each measured page, then records every response, request type, status, cache result, cache-control value, age, TTFB, and duration. Page records also contain navigation timing, first paint, first contentful paint, and transferred bytes. The later client-navigation pass uses a warm browser cache and captures prefetch and RSC traffic.

The k6 run writes `load-tests/artifacts/k6-metrics.json.gz`. The analyzer turns this stream into `k6-report.md`, grouped by exact request URL and resource type. Its streaming histogram reports percentile bucket ceilings, marked with `≤`, without loading millions of samples into memory. Generated artifacts are ignored by Git.

The audit uses the project's Playwright installation when available. On a clean checkout it builds a pinned Playwright 1.57 runner image. The load test uses a local `k6` binary when available. Otherwise it starts the pinned `grafana/k6:0.54.0` image with host networking.

## Test profiles

| profile | purpose | shape |
| --- | --- | --- |
| `verify` | Check script and manifest wiring | 1 virtual user for 2 seconds |
| `smoke` | Validate the capture and thresholds | 2 virtual users for 20 seconds |
| `warm` | Fill Varnish and Next.js caches | 25 virtual users for 1 minute |
| `ramp` | Find the first saturation point | 100, then 500 virtual users over 9 minutes |
| `spike` | Test request coalescing and recovery | Jump from 100 to 2,000 virtual users |
| `soak` | Find leaks and cache churn | 500 virtual users for about 1 hour |

Every virtual user rotates among desktop, mobile, crawler, Chrome, Safari, and Firefox user-agent strings. k6 simulates hosts, but all processes on one machine still share one source IP and one CPU/network ceiling.

By default k6 requests each HTML document and the same-origin assets that Chromium observed for that route. Use `ASSETS=none` to isolate dynamic HTML capacity. Use `ASSETS=all` only when you intend to load third-party CDNs too.

```sh
ASSETS=none THINK_TIME=0 scripts/load-test run ramp
ASSETS=local MAX_BATCH=12 scripts/load-test run spike
MIN_DOCUMENT_HIT_RATE=0.95 scripts/load-test run warm
```

The last command fails its threshold when fewer than 95 percent of cache-classified HTML requests hit. Leave the setting unset while collecting a baseline.

To isolate the worktree proxy from the shared HTTPS gateway, target nginx's published port
and preserve the newsroom host explicitly:

```sh
TARGET=http://127.0.0.1:18066 \
HOST_HEADER=t3code-9b280e28.bea.app.homer.prezly.dev \
K6_OUTPUT=./load-tests/artifacts/k6-warm-direct.json.gz \
scripts/load-test run warm
```

## Multiple load-generator hosts

k6 execution segments split one deterministic test among machines. Copy the same audit manifest to every generator, keep their clocks synchronized, and start them together. For four machines:

```sh
K6_EXECUTION_SEGMENT_SEQUENCE='0,1/4,1/2,3/4,1' \
K6_EXECUTION_SEGMENT='0:1/4' scripts/load-test run ramp
```

Use `1/4:1/2`, `1/2:3/4`, and `3/4:1` on the other machines. Set a distinct output on each host, such as `K6_OUTPUT=./load-tests/artifacts/k6-host-1.json.gz`. The target sees different source IPs only when the generators run on different hosts.

Do not jump straight to the spike profile. One laptop rarely generates or receives a credible 10,000-user test. Increase load until latency or errors bend upward, then repeat from more generator hosts.

## Reading cache results

A healthy warm run should show:

- The first request for each cache key is a miss.
- Repeated HTML and RSC requests become hits, with an increasing `Age` header.
- Hashed `/_next/static/` assets become hits or are served cheaply by a dedicated static path.
- Errors and private responses never enter the cache.

If every HTML request remains a miss, stop the capacity test. Check the browser audit's `cacheControl` and `cache` fields. `private`, `no-cache`, or `no-store` makes Varnish create hit-for-miss objects under its built-in policy, even when the VCL assigns a seven-day TTL. Fix the response policy before testing scale.

Also compare three views while k6 runs:

```sh
scripts/bea-env logs app
scripts/bea-env exec varnish varnishstat -1
docker stats --no-stream
```

Useful Varnish counters include `MAIN.cache_hit`, `MAIN.cache_miss`, `MAIN.cache_hitpass`, `MAIN.backend_req`, `MAIN.busy_sleep`, `MAIN.busy_wakeup`, and `MAIN.n_lru_nuked`. The request header report explains which URLs miss. `varnishstat` explains what the cache did as a whole.

## A sensible path to tens of thousands of visitors

Treat “visitors” as a workload, not a concurrency target. Measure page views per second, requests per page, bytes per page, and the share of warm versus cold cache keys. Then work in this order:

1. Prove identical anonymous requests share a cache key and become hits.
2. Keep RSC, cookies, locale headers, query strings, compression, and host handling in the test mix. Each can split or bypass the cache.
3. Run `warm`, then step up request rate until p95 latency, errors, backend requests, or CPU leave the flat part of the curve.
4. Verify a cold-cache spike. Request coalescing should keep a popular missing object from causing one Next.js render per waiting client.
5. Repeat with multiple load generators. Watch Next.js upstream API calls and memory-cache metrics as well as Varnish.
6. Test purge and content-update behavior. A seven-day TTL is safe only if invalidation is reliable.

Varnish is useful when many visitors request the same public page and Next.js cannot emit or retain a shared response cheaply. It will not rescue private HTML, highly fragmented cache keys, personalized pages, or an upstream API that runs once per request. Measure those conditions first, then decide whether Varnish earns its operational cost.
