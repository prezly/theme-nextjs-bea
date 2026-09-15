# Local Varnish policy

`default.vcl` supplies the local Docker backend and loads `policy.vcl`. The policy starts with the production newsroom VCL: it removes cookies, assigns a seven-day default TTL, keys objects by hostname and URL, tags them by newsroom UUID and theme, and supports the production `BAN` and `PURGE` contract.

Bea reads its tenant configuration from the request-scoped `X-Prezly-Env` header, so Next.js marks its dynamic pages `private, no-cache, no-store`. The local policy explicitly stores successful HTML and React Server Component responses despite that header. The complete URL, including Next.js's `_rsc` parameter, remains part of the cache key, and Varnish honors the response's `Vary` header for router-state variants.

Requests containing the `preview` query parameter or `theme-nextjs-bea-preview` cookie bypass the page cache. Hashed `/_next/static/` assets remain cacheable during preview. Secret story links under `/s/` also bypass the cache. A newsroom UUID BAN removes the newsroom's HTML and RSC objects together.

Validate the policy without the application or a live API:

```sh
scripts/test-varnish
```
