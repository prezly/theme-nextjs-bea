# Public story 404 caching

Dynamic Next.js 404s normally carry `private, no-cache, no-store, max-age=0, must-revalidate`. The matching newsroom Varnish policy can store a public story 404 for 30 seconds when Bea emits the conditional origin header `X-Prezly-Cache-Policy: public-story-404-v1`.

The middleware observes its existing public-slug API lookup. Theme Kit maps API 403, 404 and 410 to null; only a null paired with one observed API 404 grants the signal. The observer does not add a request or modify its response. It uses a stable explicit request scope for every public-slug middleware lookup, including ineligible requests, so successful entries remain shared. Page-rendering clients retain their existing cache identity. Cached/coalesced nulls without an observed 404 fail closed.

The signal is disabled in preview mode, for non-GET/HEAD methods, private/authenticated/cookie requests, unknown query parameters, and RSC/prefetch/forced-fresh context visible to middleware. The public story route alone installs the observer; secret and preview UUID routes do not emit this policy. Query parameters are limited to the explicit tracking allowlist in the helper. Category, gallery and other route 404s are unchanged.

Next.js strips Flight headers before middleware. Therefore the matching Varnish change records original cookie/Flight context in `X-Prezly-Negative-Cache-Bypass`, and independently requires final status 404 and `text/html` before storing. A conditional header on a directly requested RSC response cannot grant cacheability. Varnish strips client policy headers, checks response privacy such as Set-Cookie and Vary, removes the policy header on delivery, and sends `Cache-Control: no-store` downstream. The response marker does not alter Next.js or browser caching by itself.

Since Theme Kit 10.10.1 a `null` story result is itself cached for 60 seconds (`ContentDelivery.DEFAULT_NEGATIVE_TTL`), in memory and in Redis, with the deadline enforced on read. Within that window repeated lookups of the same missing slug are served from the content cache with no API call and no observed 404, so they do not renew the Varnish policy; the first lookup, which observes the API 404, still grants it and Varnish keeps its own 30-second object. A cache version change on publish invalidates the cached null immediately. Paths the middleware rejects before any lookup are covered in `STORY_SLUG_PREFILTER.md`.

Deploy Bea first, then the matching ops VCL change. Older Varnish ignores this header, so origin-only deployment does not activate negative caching. New Varnish leaves old/unmarked theme responses under their existing policy. Publication BAN invalidates the cached 404 immediately; otherwise it expires after 30 seconds without grace. Neither side requires a global purge. This is the public-story part of DEV-24174, not completion of the general successful-response cache contract.

Run the application policy regressions without a live API or browser:

```sh
pnpm exec playwright test tests/publicNotFoundCache.spec.ts --reporter=line
pnpm typecheck
pnpm check
pnpm build
```

The tests use the real SDK and ContentDelivery with synthetic responses to distinguish 403/404/410, propagate 401/429/5xx and transport failures, and check request exclusions and observer isolation. The paired ops native Varnish suite verifies MISS→HIT, request/response exclusions, publication invalidation and actual 30-second expiry.
