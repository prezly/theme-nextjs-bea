# Flight render marker

Bea certifies its React Server Components (Flight) responses so the shared Varnish cache can store them. The certification is the response header `X-Prezly-Render: complete`.

## Why a marker

Next.js streams Flight payloads. When a data call fails after the first byte, the response still ends with HTTP 200 and carries the error as a row inside the body (`<id>:E{"digest":"..."}`). A cache that stores on status alone keeps that error until its TTL runs out, which for newsroom pages is seven days. A navigation to a missing page behaves the same way: HTTP 200 with a `NEXT_HTTP_ERROR_FALLBACK;404` row. Only something that has read the whole stream can tell a complete render from a failed one.

## How it works

`server/start.mjs` is the container entrypoint. It starts Next.js on an internal port (3001, `NEXT_UPSTREAM_PORT`) with its usual bind address, and `server/flight-guard.mjs` on the public one (3000, `PORT`). The guard starts listening only once Next.js accepts connections, so the TCP readiness probe on port 3000 keeps its meaning.

For a `GET` with `RSC: 1` whose response is `text/x-component`, the guard:

1. asks Next.js for an uncompressed body (`Accept-Encoding` is dropped on the upstream request; Varnish and Cloudflare compress downstream),
2. buffers the body up to `FLIGHT_GUARD_MAX_BYTES` (2 MiB),
3. walks the Flight row framing: `<hex id>:<tag><data>\n` for every row, except `T` text rows, which are `<id>:T<hex byte length>,<raw bytes>` with no newline and content that may itself look like a row,
4. sends the response with `Content-Length` and one `X-Prezly-Render` value:

| Value | Meaning |
| --- | --- |
| `complete` | status 200, stream ended cleanly, framing consistent, no `E` row |
| `error_row` | at least one `E` row; the digests are logged as `flight_guard_incomplete` |
| `truncated_row`, `invalid_row_id`, ... | framing inconsistent to the last byte |
| `status_404`, `status_500`, ... | not a 200 |
| `oversize` | larger than the limit, forwarded uninspected |

A stream that Next.js drops mid-body becomes a 502 with `X-Prezly-Render: truncated`, since nothing in it is reusable.

Everything else, including HTML, assets, API routes and `HEAD` requests, streams through untouched, with upstream compression and chunking intact. Any `X-Prezly-Render` header on an incoming request or on the upstream response is removed first, so the guard is the only source of the marker.

Varnish stores a Bea Flight response for seven days only when the marker is `complete` (ops `tests/varnish/rsc-cache.vtc`). Every other Flight response is delivered but not stored, and the next request renders again.

## Running it

`pnpm start` runs the guarded entrypoint; `pnpm start:next` runs bare `next start`. Tests live in `tests/flightGuard.spec.ts`. The ops repository has an end-to-end check against the full build with a synthetic API (`tests/bea-rsc/check-guard.mjs`).

Logs to watch: `flight_guard_incomplete` (a render with error rows, with path and digests), `flight_guard_truncated`, `flight_guard_oversize`, `flight_guard_upstream_error`.
