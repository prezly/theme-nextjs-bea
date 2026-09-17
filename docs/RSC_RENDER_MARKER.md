# Flight render marker

Bea certifies its React Server Components (Flight) responses so the shared Varnish cache can store them. The certification is the response header `X-Prezly-Render: complete`.

## Why a marker

Next.js streams Flight payloads. When a data call fails after the first byte, the response still ends with HTTP 200 and carries the error as a row inside the body (`<id>:E{"digest":"..."}`). A cache that stores on status alone keeps that error until its TTL runs out, which for newsroom pages is seven days. A navigation to a missing page behaves the same way: HTTP 200 with a `NEXT_HTTP_ERROR_FALLBACK;404` row. Only something that has read the whole stream can tell a complete render from a failed one.

## How it works

`server/start.mjs` is the container entrypoint. It starts Next.js on an internal port (3001, `NEXT_UPSTREAM_PORT`) with its usual bind address, and `server/flight-guard.mjs` on the public one (3000, `PORT`). The guard starts listening only once Next.js accepts connections, so the TCP readiness probe on port 3000 keeps its meaning.

For a `GET` with `RSC: 1` whose response is `text/x-component`, the guard:

1. asks Next.js for an uncompressed body (`Accept-Encoding` is dropped on the upstream request; Varnish and Cloudflare compress downstream),
2. buffers the body up to `FLIGHT_GUARD_MAX_BYTES` (2 MiB),
3. walks the Flight row framing: `<hex id>:<tag><data>\n` for every row, except text (`T`) and typed-array rows (`A O o U S s L l G g M m V`), which are `<id>:<tag><hex byte length>,<raw bytes>` with no newline and content that may itself look like a row, and collects the rows referenced from model rows (`"$<id>"`, `"$L<id>"`, `"$@<id>"`),
4. sends the response with `Content-Length` and one `X-Prezly-Render` value:

| Value | Meaning |
| --- | --- |
| `complete` | stream ended cleanly, framing consistent, every referenced row present, no `E` row |
| `error_row` | at least one `E` row; the digests are logged as `flight_guard_incomplete` |
| `missing_row` | a model row references a row that never arrived (a stream cut on a row boundary) |
| `truncated_row`, `invalid_row_id`, ... | framing inconsistent to the last byte |
| `oversize` | larger than the limit; the bytes are streamed on as they are, uninspected |

A stream that Next.js drops mid-body becomes a 502 with `X-Prezly-Render: truncated`, since nothing in it is reusable. Only a 200 is inspected: other statuses stream through with no marker at all, because Varnish merges the headers of a 304 into the object it revalidates and a value there would overwrite that object's certification.

Everything else, including HTML, assets, API routes and `HEAD` requests, streams through untouched, with upstream compression and chunking intact. When a client disconnects, the guard aborts the matching Next.js request so no render or keep-alive socket stays pinned; when Next.js drops a streamed response, the guard ends the client connection instead of leaving it waiting. Any `X-Prezly-Render` header on an incoming request or on the upstream response is removed first, so the guard is the only source of the marker.

On `SIGTERM` the guard stops accepting, lets in-flight responses finish (up to `FLIGHT_GUARD_DRAIN_TIMEOUT`, 15 s) and only then signals Next.js. The Deployment pairs this with a `preStop` pause so the pod leaves the Service before it stops accepting.

Varnish stores a Bea Flight response for seven days only when the marker is `complete` (ops `tests/varnish/rsc-cache.vtc`). Every other Flight response is delivered but not stored, and the next request renders again.

## Running it

`pnpm start` runs the guarded entrypoint; `pnpm start:next` runs bare `next start`. Tests live in `tests/flightGuard.spec.ts`. The ops repository has an end-to-end check against the full build with a synthetic API (`tests/bea-rsc/check-guard.mjs`).

Logs to watch: `flight_guard_incomplete` (a render with error rows, with path and digests), `flight_guard_truncated`, `flight_guard_oversize`, `flight_guard_upstream_error`.
