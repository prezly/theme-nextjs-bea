# Public pagination (DEV-24156)

Bea's story and hub-story UI uses 12 records (13 for masonry story lists), and
media galleries use six. The three public JSON endpoints now accept limits from
1 to 20. Story/hub defaults remain 20; galleries explicitly default to six,
matching the UI. Unsupported, repeated or malformed parameters return HTTP 400
before resolving an adapter/cache. Configured locale and category membership
are validated through the existing cached metadata methods before content reads.

Only offset/limit, story/hub locale, and ordinary-story category/tag filters are
supported. Tags retain meaningful whitespace and are limited to the database's
255 Unicode characters. Locale case/separator variants normalize to the
configured API code; language-only and regional/script locales stay distinct.
The load-more UI no longer sends its ignored generic query parameter.
Already-loaded older UI builds may still send the one-ID exclusion shape. Only
that bounded legacy no-op remains accepted, without forwarding it to the SDK or
giving it a different cache key; arbitrary query objects remain unsupported.

Offsets at or above 1,000 first read a bounded matching first page and its count.
Ordinary stories/galleries reuse existing ContentDelivery caching for this read.
An offset outside the matching result returns an empty page with the current
total without fetching/storing that deep offset. Both Cache-Control and
Surrogate-Control prohibit response retention; Varnish may retain its short
hit-for-miss marker. Valid deep archives remain reachable, rather than imposing
an arbitrary maximum archive size. Valid deep reads can incur an additional
first-page read, particularly on the currently uncached hub path; membership is
resolved only once per hub request. Transport/API failures continue to propagate.

Initial server and load-more list calls normalize only proven SDK-equivalent
arguments: property ordering, full category references versus IDs, locale
objects versus codes, and default zero offset/highlight count. Meaningful query,
search, tag/order, locale, pagination and gallery type dimensions remain.
Source/authorization/version scoping is still owned by the existing adapter.
No TTL, cache layer or routing data is changed; old keys expire naturally.

The separate sitemap path continues to use 200-record API batches. Neither the
story nor gallery argument normalizer caps internal/batch reads.

## Regression evidence

`pnpm exec playwright test tests/publicPagination.spec.ts --project=chromium`
runs without a live app/browser or production credentials. It covers cheap
rejection, ordinary flows, real deep archives, result-set boundaries, failure
propagation, public projection and hub/source restrictions, and actual Theme
Kit cache behavior. In the equivalent-call fixture, three origin requests and
retained entries become one; serialized fixture key/value bytes fall from
1,409 to 297. This is isolated evidence, not a production SQL/CPU or capacity
measurement. The accepted per-request record ceiling falls from 1,000 to 20.

`tests/public-list-cache-admission.vtc` was run through the ops repository's
`tests/varnish/run.py` against the actual newsroom GitOps VCL, in its pinned
network-disabled Varnish 7.5.0 image. Repeated empty-probe responses both reached
the fixture backend despite the successful-response Cache-Control override.
To rerun, mount this fixture read-only into the documented ops test container
and supply its path as the runner's positional case argument. The private ops
source is needed for this optional policy check; PR CI exercises the handler,
input and real cache regressions without cross-repository access.

Live SQL/CPU and payload comparisons can use the existing DEV-24148 telemetry
after deployment. No production load or publication/unpublication test was run.
