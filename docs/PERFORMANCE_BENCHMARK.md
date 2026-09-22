# Next.js performance benchmark

This bounded suite crawls a site for a deterministic sample of same-origin pages, then measures HTML and RSC responses with curl and full navigation with Playwright. It writes a compact `report.md` and the complete `report.json`, including every failed request.

## Run it

Requirements are Node.js, pnpm, curl and Playwright Chromium:

```sh
pnpm install
pnpm exec playwright install chromium

# Crawl first and inspect the deterministic route sample without running the benchmark
pnpm benchmark -- --profile performance/profiles/lifelog.json --crawl-only

# Run curl and Playwright
BENCHMARK_LOCATION=eu-west-local pnpm benchmark -- --profile performance/profiles/lifelog.json

# Compare with an earlier artifact and fail on regressions or request failures
pnpm benchmark -- --profile performance/profiles/lifelog.json \
  --baseline previous/report.json --fail-on-regression
```

Use `--base-url https://fixture.example` and `--routes /,/story/example,/?page=2` to override a profile. `--http-only` is useful where Chromium is unavailable. Reports go to `performance-results/` unless `--output-dir` is specified.

Included profiles:

- `prezly.json`: homepage, pricing and Academy.
- `lifelog.json` and `snohetta.json`: homepage, explicit pagination and a seeded sample crawled from article links, including representative story pages.

To add a site, copy a profile, change `name`, `baseUrl` and known `routes`, and keep crawling bounded. Run `--crawl-only` to review what the fixed seed selects before scheduling it. Pin important story routes explicitly if they must remain in the sample after navigation changes.

## Safety and cache semantics

The executable enforces non-configurable ceilings of 25 routes, 50 crawled pages, 5 curl requests/second, 1 browser navigation/second, 10 repeats per curl phase and 5 browser repeats. The checked-in profiles are lower: one serial curl request/second and one browser navigation per five seconds. The crawler is also capped at one request/second. Do not raise these caps to rehearse traffic spikes; use the separate load-testing harness for that.

For each HTML and `_rsc` variant, `cold` means only the first observation by this suite. It does not purge or bypass a production CDN and can already be a HIT. One warm-up request follows, then measured warm repeats. Trust the recorded `cf-cache-status`, `Age`, `Cache-Control` and CDN headers when interpreting cache state. `x-nextjs-cache` is recorded but is never classified as a CDN hit. Run baselines and comparisons from the same named `BENCHMARK_LOCATION`; network and shared-cache variability means these are trends, not guaranteed targets.

curl records DNS, TCP, TLS, TTFB, total, redirects, status and body sizes. `networkBytes` is curl's transfer measurement; `responseBytes` is the decoded output written by `--compressed`; `Content-Length` and `Content-Encoding` are retained when the server supplies them. The browser report includes navigation timing, DOM interactive/load timing, main-document transfer/decoded sizes and a request waterfall. An optional safe selector measures click completion time rather than claiming framework-specific hydration.

The defaults fail comparison when warm TTFB p95 or browser navigation p95 grows over 20%, or median decoded payload grows over 10%. Keep a known report JSON as the baseline artifact; changing the profile, runner location or build should normally establish a new baseline.

## Optional instrumentation and invalidation

Profiles can set `instrumentation.listItemSelector`, `interactionSelector`, and `replicaHeaders`. Serialized `#__NEXT_DATA__` bytes, rendered/visible item counts and replica header values are reported when present. Redis cache-entry bytes/read/decode time cannot be observed externally and is explicitly marked unavailable; correlate the report timestamp with server telemetry when that instrumentation exists.

Content mutation is off by default and must never be enabled in routine production probes. A fixture/staging profile may define:

```json
{
    "invalidation": {
        "safeFixture": true,
        "mutationUrl": "https://fixture.example/test-only/update",
        "method": "POST",
        "authorizationEnv": "BENCHMARK_FIXTURE_TOKEN",
        "maxWaitSeconds": 60,
        "pollSeconds": 5
    }
}
```

Only `--run-invalidation` executes it. The runner hashes HTML and RSC before mutation and polls until both change. Secrets are read from the named environment variable, are never put in the report, and must be stored in CI secret storage. Do not add tokens, authenticated URLs or customer data to profiles.

## CI and trend reports

The `Performance benchmark` workflow runs the bounded Lifelog profile weekly and supports manual profile/release runs. It retains JSON and Markdown artifacts for 90 days. Download a prior `report.json` and pass it with `--baseline` for release comparisons; artifacts should not be treated as public if target URLs themselves are sensitive.