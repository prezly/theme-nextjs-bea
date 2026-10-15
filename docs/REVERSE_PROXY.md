# Reverse-proxy newsrooms

Bea can serve a newsroom under a path on a customer's own domain, for example
`https://ab-inbev.be/nl_BE/news/…` or `https://www.sony.eu/presscentre/…`. The
customer's CDN or proxy forwards that path to the newsroom's `*.prezly.com` host.

All of this is opt-in per newsroom. With none of the settings below, paths, links,
redirects, canonical URLs and structured data are unchanged.

This support used to live in the `theme-nextjs-bea-reverse` fork.

## Configuration

| Setting | Read | Purpose |
| --- | --- | --- |
| `THEME_BASE_PATH` | per request, `X-Prezly-Env` | Flat prefix at the root, e.g. `/presscentre` |
| `THEME_LOCALE_SUBDIR` | per request, `X-Prezly-Env` | Subdir after the locale slug: `*:news` (every locale) or `nl_BE:news,fr_BE:presse` |
| `THEME_LOCALE_SLUG_FORMAT` | per request, `X-Prezly-Env` | Locale segment shape: `short` (default, `nl`), `iso` (`nl-BE`), `iso-lower` (`nl-be`), `code` (`nl_BE`), `code-lower` (`nl_be`) |
| `NEXT_PUBLIC_ASSET_PREFIX` | build time and runtime | Origin that serves `/_next/*`, e.g. `https://bea-reverse-assets.prezly.com` |

The three `THEME_*` settings map to the admin **Reverse proxy** tab and change
without a rebuild. Process env is the fallback, for local development.

`THEME_LOCALE_SLUG_FORMAT` must match exactly what the customer's proxy forwards.
Otherwise every page redirects to our format and the proxy returns a 404.

AB InBev, for reference: `THEME_LOCALE_SUBDIR=*:news`, `THEME_LOCALE_SLUG_FORMAT=code`,
giving URLs like `/nl_BE/news/<slug>`.

## Request flow

```
browser ──► customer proxy ──► <newsroom>.prezly.com
  GET /nl_BE/news/<slug>             page: forwarded, path kept
  GET /nl_BE/news/api/stories        data: forwarded, tunnelled to /api/*
  GET https://<asset host>/_next/…   assets: loaded directly, bypassing the proxy
```

- **Pages.** `middleware.ts` strips the base path or subdir with `stripBasePath()`,
  routes the canonical path through `IntlMiddleware`, and puts the prefix back on any
  redirect `Location`.
- **URL generation.** The server (`src/adapters/server/routing.ts`) and client
  (`src/adapters/client/routing.tsx`) wrap `generateUrl` and `generateAbsoluteUrl` so
  every emitted URL carries the prefix (`applyBasePath`) and the configured locale
  slug shape. The client gets the settings from `BasePathProvider`.
- **`/api/*`.** Client data requests go to `/<prefix>/api/…`, which the customer's
  proxy forwards. The middleware rewrites them to the `/api/*` handler, so the calls
  stay same-origin.
- **`/_next/*`.** Loaded from `NEXT_PUBLIC_ASSET_PREFIX`, because the customer's proxy
  only forwards the page path.

The pure path logic is in `src/utils/basePath.ts`, tested in `tests/basePath.spec.ts`.
`tests/reverseProxyMiddleware.spec.ts` runs the middleware itself.

## Gotchas

Each of these was a production bug.

### `assetPrefix` is needed at build time and at runtime

Next.js reads `assetPrefix` at build time (webpack public path, for dynamically
loaded chunks) and again at runtime (the server-rendered CSS `<link>`, bootstrap
scripts and fonts). Set only at build, JS chunks get the prefix but CSS and fonts
stay at `/_next/…` and 404 behind the proxy. Set it in the build env and the
deployment env.

### The asset host must not depend on a newsroom

Never point `NEXT_PUBLIC_ASSET_PREFIX` at a newsroom's own domain. If that newsroom
moves to another theme, `/_next/*` breaks for every newsroom using it. Use a
dedicated host that serves the theme deployment directly
(`bea-reverse-assets.prezly.com`).

### `/_next/*` can't be tunnelled

`/api/*` can ride the page path because we build those URLs. Next.js builds the
`/_next/*` URLs from one build-time `assetPrefix`, which can't vary per newsroom or
locale. So assets must come from a separate host.

### Trailing-slash redirects break soft navigation to the index

If the proxy 301s `/<locale>/news` to `/<locale>/news/`, a client-side navigation to
the index fetches the RSC payload at the no-slash URL, hits the 301, and only the URL
changes. Full page loads are fine. When reverse-proxy settings are active, `Link`
and `LanguagesDropdown` force a full navigation for index links (logo, language
switcher, 404 back-home). `trailingSlash: true` is not a fix: it 404s the index in
our middleware. The clean fix is for the proxy to drop the redirect.

### Legacy proxies that strip the prefix

Older proxies strip `/<culture>/news/` and pass the culture in
`X-Prezly-Reverse-Proxy-Culture`. Bea resolves the locale from the path, so the
middleware uses this header as the default locale. A locale in the path, and story
locale resolution, still win. Only newsrooms with a base path or locale subdir
honour it, since any client can send the header. Production Varnish currently
removes it before it reaches the theme. Prefer proxies that forward the full path.

### Canonical, og:url and structured data

- Story canonical and `og:url` default to the backend `oembed.url`. Behind a reverse
  proxy, the story page uses the theme's own prefixed URL instead. An explicit
  `seo_settings.canonical_url` always wins.
- Related stories and story bookmarks link via `oembed.url`, so they are re-prefixed
  with `applyBasePathAbsolute`.
- JSON-LD (`NewsArticle.url`, `mainEntityOfPage`, `Organization.url`,
  `publisher.url`) uses the same URLs as the canonical. A canonical and a
  structured-data URL that disagree are worse for SEO than either being wrong alone.
  If you add another JSON-LD schema with a URL, give it the same treatment.

## Infrastructure

Lives in `prezly/ops`.

1. **Asset host.** `bea-reverse-assets.prezly.com`: an Ingress pointing at the
   `bea-reverse` theme Service (not the newsroom router or Varnish), with the
   `*.prezly.com` certificate, CORS enabled and scoped to `/_next/`.
2. **`NEXT_PUBLIC_ASSET_PREFIX`** in the image build and in the deployment env.
3. **The customer's proxy** forwards the full path with `Host: <newsroom>.prezly.com`.
   It does not need to forward `/_next/*` or `/api/*`.
