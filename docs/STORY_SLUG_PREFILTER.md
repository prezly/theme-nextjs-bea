# Story slug pre-filter

The story route matches any single path segment. Before this filter, every probe such as `/favicon.ico`, `/wp-login.php` or `/tel:+123` reached the story API twice: once from the Edge middleware's locale resolution and once from the Node page. Both answered 404, and because scanner URLs rarely repeat, neither result was reused. On 2026-09-15 one Bea pod recorded 78,749 story-by-slug API calls with a 4xx result in 18 hours.

`isPossibleStorySlug` in `src/utils/isPossibleStorySlug.ts` rejects a segment when the API could never have stored it as a slug:

* it contains a character the API's `SlugValidator` forbids (`& $ + , / : ; = ? @ # space < > [ ] { } | \ ^ % ! '`), or
* it ends in a file extension that scanners probe for (`.php`, `.json`, `.xml`, `.txt`, `.ico`, `.js`, `.css`, images, archives, config files), or
* it is empty or not valid percent-encoding.

Everything else passes, including percent-encoded non-ASCII slugs, uppercase, dots inside a slug such as `web-2.0`, and `.html` or `.pdf` endings that migrated sites keep as custom slugs. Generated slugs are letters, digits and hyphens; custom slugs may contain any character outside the forbidden list, which is why the filter does not reject dots in general.

The check runs in two places. The story route in `src/adapters/server/routing.ts` uses it as the route `check`, so the middleware treats a rejected segment as an unmatched path and rewrites it to the not-found page without calling the API. The story page repeats it, and also rejects the middleware's `_error404` rewrite target, so a direct request to the internal `/:localeCode/:slug` path does not reach the API either.

Two-segment paths such as `/x/swagger.json` never matched the story route and cost nothing before or after this change. Repeated requests for the same missing slug are covered by request coalescing, the 30-second Varnish 404 policy and, once Theme Kit ships negative caching (DEV-24151), the content cache.

Run the regression without a live API:

```sh
pnpm exec playwright test tests/storySlug.spec.ts --reporter=line
pnpm typecheck
pnpm check
```

After deploy, `theme_kit_upstream_requests_total{route="story_by_slug",status_class="4xx"}` on the newsroom dashboard should fall by roughly the share of dotted single-segment 404s, about 80% of lookup-triggering 404s in the 2026-09-15 samples.
