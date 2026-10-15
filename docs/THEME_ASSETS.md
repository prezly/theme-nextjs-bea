# Theme static assets on R2

Production builds can serve `/_next/static` (JS, CSS, fonts) from a shared Cloudflare
R2 bucket instead of the theme pods:

```
https://theme-assets.prezly.com/<repository>/_next/static/…
```

This fixes two problems with serving assets from the pods:

- **Rollouts.** During a rolling deploy, a page rendered by a new pod could request a
  chunk from an old pod, which doesn't have it.
- **Cached HTML.** Varnish keeps HTML for up to 7 days, and customer CDNs may keep it
  longer. After a deploy, those pages point at files the new build no longer has.

Every build uploads its files and nothing is deleted on deploy, so any page from any
recent build can load its assets. It also lets reverse-proxy newsrooms load assets
from a stable Prezly host, since their customer's proxy only forwards page paths
(see [REVERSE_PROXY.md](./REVERSE_PROXY.md)).

## How it works

`build-and-push.yml` (main branch only):

1. Builds the image with `NEXT_PUBLIC_ASSET_PREFIX=<THEME_ASSETS_URL>/<repository>`.
   The Dockerfile sets it in the builder stage and in the runtime image, because
   Next.js reads `assetPrefix` at build time and again in `next start`.
2. Copies `.next/static` out of the image and uploads it to R2 with
   `Cache-Control: public, max-age=31536000, immutable`.
3. Pushes the image to ECR only after the upload succeeds, so a rollout can never
   reference files that aren't uploaded yet.

When the `THEME_ASSETS_URL` repository variable is empty, steps 1 and 2 are skipped and
the theme serves its own assets, as before. The preview image never uses R2.

## Setup

One bucket and host serve every theme; each repository gets its own path.

1. **Bucket.** Create an R2 bucket, e.g. `prezly-theme-assets`.
2. **Custom domain.** In the bucket settings, connect `theme-assets.prezly.com`
   (R2 → bucket → Settings → Custom Domains). Keep public `r2.dev` access disabled.
3. **CORS.** Fonts load cross-origin from newsroom and customer domains. R2's own CORS
   headers are only sent when the request has an `Origin` header, and Cloudflare may
   cache a copy without them. Add a response header transform rule instead:
   `http.host eq "theme-assets.prezly.com"` → set `Access-Control-Allow-Origin: *`.
   The zone's rulesets are in `prezly/ops` → `infra/terraform/cloudflare/prezly.com`;
   run `terraform plan` before adding the rule there, since an apply replaces the
   whole ruleset.
4. **Lifecycle rule (optional).** Delete objects older than 90 days. Each build
   re-uploads all its files, so files still in use never get that old.
5. **API token.** Create an R2 API token with *Object Read & Write* on this bucket only.
6. **GitHub, per theme repository** (or as organization secrets and variables):

   | Name | Kind | Value |
   | --- | --- | --- |
   | `R2_ACCESS_KEY_ID` | secret | from the token |
   | `R2_SECRET_ACCESS_KEY` | secret | from the token |
   | `R2_ACCOUNT_ID` | variable | Cloudflare account ID |
   | `THEME_ASSETS_BUCKET` | variable | `prezly-theme-assets` |
   | `THEME_ASSETS_URL` | variable | `https://theme-assets.prezly.com` |

   Set `THEME_ASSETS_URL` last: it is the switch.

## Rollout

The Bea image serves every Bea newsroom, so switching it on moves all of them at once.

1. Do steps 1–5 and set the secrets and the other variables.
2. Check the host: upload a test file to the bucket and confirm
   `curl -I https://theme-assets.prezly.com/<path>` returns `200` with
   `access-control-allow-origin: *` and the long `cache-control`.
3. Set `THEME_ASSETS_URL` and run the workflow (Actions → *Build image and push Bea
   image to ECR* → Run workflow).
4. After Flux rolls out the image, open a few newsrooms: page source should load
   `/_next/static` from `theme-assets.prezly.com`, and the browser console should show
   no 404 or CORS errors. Check a story page, the language switcher and a font.

To roll back, clear `THEME_ASSETS_URL` and run the workflow again. Pages cached during
the R2 period keep working, because their files stay in the bucket.
