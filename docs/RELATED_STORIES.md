# Related story queries

Public, secret and preview story routes resolve the story without requesting
related stories during metadata generation. Rendering applies the saved theme
settings and any effective preview overrides before requesting a related list.
When `show_read_more` is false, no related list is requested.

When enabled, the routes request four candidates from the same ContentDelivery
client they used before this change. ContentDelivery limits candidates to the
current newsroom and route locale, published status and public visibility, sorted
by pinned status and publication date. Removing the resolved story UUID locally
and taking the first three preserves that ordering. It also handles a current
story outside the candidates, including private/draft stories, and short archives.
Secret and preview URL tokens are not used as story identities for exclusion.

There is no additional cache. Public/secret reads use the existing adapter's
source, authorization, newsroom, locale and cache-version boundaries. Preview
reads keep the explicitly uncached client and do not consume or populate the
public list cache. Publication invalidation still depends on the existing
`X-Newsroom-Cache-Version` mechanism; this change does not alter that mechanism.

## Regression checks

```sh
pnpm exec playwright test tests/relatedStories.spec.ts --project=chromium --workers=1 --reporter=line
pnpm typecheck
pnpm check
CI=true pnpm build
```

Use the repository's Node 22 and pinned pnpm 9.15.4. These tests execute the actual
async route exports with framework/UI boundaries replaced, plus real
SDK/ContentDelivery/PrezlyAdapter calls against an isolated fetch fixture. They
need no browser, API credentials or running newsroom. The dedicated GitHub
workflow runs typecheck and the focused regressions.

The five-page public-route fixture compares the previous three-story query with
a per-slug exclusion to the shared four-story query:

| Measurement | Before | After |
| --- | ---: | ---: |
| Origin list calls | 5 | 1 |
| Distinct list-cache entries | 5 | 1 |

The returned cards are identical in that fixture, including a pinned current
story, each position in the first four and a current story outside the list.
This is a deterministic local comparison, not a production CPU/SQL benchmark.
