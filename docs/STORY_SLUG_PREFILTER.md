# Story slug pre-filter and not-found rewrite marker

The story route matches any single path segment, and Theme Kit's IntlMiddleware rewrites every unmatched path to `/:localeCode/_error404`, which the story page serves. Before this change every public 404 therefore reached the story API: a single-segment probe such as `/favicon.ico` or `/tel:+123` once from the Edge middleware and once from the Node page, and a multi-segment probe such as `/x/swagger.json` once from the Node page for the `_error404` slug. On 2026-09-15 one Bea pod recorded 78,749 story-by-slug API calls with a 4xx result in 18 hours. Sequential probes against production confirmed both paths cost a Node lookup each; `.json` paths are the exception because Varnish routes them to the legacy backend.

## Impossible slugs

`getStorySlugRejection` in `src/utils/isPossibleStorySlug.ts` rejects a segment when the API could never have stored it as a slug, with one of these reasons:

* `forbidden_character`: a character the API's `SlugValidator` refuses (`& $ + , / : ; = ? @ # space < > [ ] { } | \ ^ % ! '`).
* `dotfile`: the segment starts with a dot (`.env.local`, `.git`, `.dockerfile`).
* `scanner_extension`: an asset, configuration or archive extension (`.js .css .map .ico .png .jpg .jpeg .gif .svg .webp .xml .txt .yml .yaml .ini .conf .cfg .toml .env .sql .bak .backup .log .zip .tar .gz .rar .7z`).
* `empty` or `invalid_encoding`.

Everything else passes: percent-encoded non-ASCII slugs, uppercase, dots inside a slug such as `web-2.0`, page-like endings such as `.html`, `.php`, `.aspx` or `.pdf` that migrated sites keep as custom slugs, `.md`, `.json`, and two-letter suffixes that look like domains (`firma.pl`). Generated slugs are letters, digits and hyphens; custom slugs may contain any character outside the forbidden list, which is why the extension list stays narrow. In the 2026-09-15 log samples no successful story path ended in any extension.

The story route in `src/adapters/server/routing.ts` uses the check as its route `check`, so the middleware treats a rejected segment as an unmatched path and never calls `resolveStoryLocale`. The story page repeats the check for direct requests to the internal `/:localeCode/:slug` path.

## Marking the not-found rewrite

`/:localeCode/_error404` is also what a story whose custom slug is literally `_error404` rewrites to, so the sentinel alone cannot tell an internal not-found from a real story. The middleware knows whether the story route matched (its `resolveStoryLocale` ran). When it did not and IntlMiddleware returned the not-found rewrite, `markNotFoundRewrite` in `src/adapters/server/not-found-rewrite.ts` re-issues the same rewrite with the request header `x-prezly-not-found-rewrite: 1` and keeps IntlMiddleware's response headers. The story page calls `notFound()` without a lookup only when the slug is `_error404` and that header is present. A story with that custom slug matched the story route, is left unmarked, and is looked up as before.

A client can send the marker header itself. It only has an effect on a request whose slug is `_error404`, where it turns a lookup into a 404, so it cannot hide any other story.

## Observability

Every marked rewrite logs one JSON line on the console (picked up by `next-logger`):

```json
{"event":"newsroom_not_found_rewrite","reason":"scanner_extension","path":"/favicon.ico"}
```

`reason` is one of the rejection reasons above or `unmatched_path` for multi-segment and other unrouted paths. Filter on a reason other than `unmatched_path` to find a false positive by path. Scanner traffic bounds the volume to a few lines per second.

## Verification

```sh
pnpm exec playwright test tests/storySlug.spec.ts tests/notFoundRewrite.spec.ts --project=chromium --reporter=line
pnpm typecheck
pnpm check
pnpm build
```

After deploy, `theme_kit_upstream_requests_total{route="story_by_slug",status_class="4xx"}` on the newsroom dashboard should fall to the rate of genuine single-segment misses: plain slug-like probes such as `/Dockerfile` and `/healthz`, and real dead links. In the samples those were about a third of single-segment 404s and none of the multi-segment ones. Repeated requests for the same missing slug are covered by request coalescing, the 30-second Varnish 404 policy and, once Theme Kit ships negative caching (DEV-24151), the content cache.

A future Theme Kit release could set the marker in IntlMiddleware itself, which would remove the sentinel detection from this repository.
