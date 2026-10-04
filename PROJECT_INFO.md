# Project information

## What this project is

Bea is an open-source Prezly newsroom theme. It renders a configurable,
multilingual pressroom with content fetched from Prezly's APIs.

The application uses:

- Next.js 15 with the App Router
- React 19 and TypeScript
- Prezly SDK, Theme Kit, and content renderer
- SCSS modules
- Meilisearch for newsroom search
- Sentry and Prezly Analytics
- Playwright for tests
- Biome for linting and formatting

## Application structure

Content does not live in this repository. The application has no local database
or standalone backend. Server adapters fetch newsroom settings, stories,
galleries, languages, and company information from Prezly.

The main request flow is:

```text
Incoming URL
  -> locale middleware
  -> App Router page
  -> server-side Prezly adapter
  -> feature module
  -> shared React components and SCSS
```

The most important directories are:

| Path | Purpose |
| --- | --- |
| `app/` | Next.js routes, layouts, metadata, and API handlers |
| `src/adapters/server/` | Prezly data access, routing, search, metadata, analytics, and environment configuration |
| `src/adapters/client/` | Browser-side routing, HTTP, locale, and theme-setting adapters |
| `src/components/` | Reusable UI components such as story cards, rich text, modals, and social sharing |
| `src/modules/` | Page-level features such as stories, galleries, search, header, footer, and subscriptions |
| `src/styles/` | Global styles, variables, and mixins |
| `src/utils/` | Parsing, sanitizing, structured data, preview, and image helpers |
| `tests/` | Playwright browser and data-sanitization tests |
| `custom/` | Empty extension point reserved for project-specific overrides |

`app/[localeCode]/layout.tsx` builds the shared page shell. It includes the
header, footer, subscription form, notifications, analytics, cookie consent,
metadata, structured data, and preview support.

`src/adapters/server/app.ts` provides the central content API used by pages.
`src/adapters/server/prezly.ts` configures the Prezly client and optional memory
or Redis caching. `src/adapters/server/environment.ts` validates runtime
configuration.

## Routes

The localized route tree under `app/[localeCode]/` contains:

- The newsroom homepage and paginated story lists
- Public, secret, and preview story pages
- Category and tag pages
- Search
- The media gallery index and individual albums
- Privacy and cookie policy pages
- Locale-specific error and not-found pages

The application also generates `robots.txt`, a sitemap, favicon responses, RSS
metadata, and JSON-LD for news articles, organizations, and websites.

`middleware.ts` discovers the newsroom's supported languages and rewrites public
URLs to internal locale-prefixed routes.

## UI and theme settings

`src/components/` contains reusable controls and content display components.
`src/modules/` combines those pieces into complete features. Most styling lives
in component-scoped SCSS modules.

`src/theme-settings.ts` defines the theme configuration and its defaults. The
settings control colors, typography, story-list layout, story-card styles,
header-image placement, sharing buttons, download actions, and featured
categories.

The `Broadcast` module updates stories, galleries, translations, notifications,
page types, and preview state while the theme runs inside Prezly's editor.
Preview query parameters can override theme settings without changing published
configuration.

## Browser API and search

The API handlers under `app/api/` support browser-side pagination:

- `/api/stories`
- `/api/hub-stories`
- `/api/galleries`

These handlers validate query parameters, fetch data from Prezly, and return
sanitized objects to client components. The API catch-all route returns a plain
404 response.

Search connects to a configured Meilisearch index. If no Meilisearch API key is
available, the server search adapter does not expose search settings.

## Configuration

The application requires a Prezly access token and newsroom UUID. A theme UUID
selects the Bea preset. Optional settings configure Redis caching, Meilisearch,
hCaptcha, Uploadcare, Sentry, and the public base URL. See `.env.example` for the
available variables.

`next.config.js` adds Theme Kit configuration, the Uploadcare image loader,
global Sass imports, SVG-to-React compilation, optional bundle analysis, and
production Sentry integration.

## Tests and delivery

The test suite contains a browser check for the homepage and focused tests for
the client-data allowlists used by stories, galleries, and newsrooms.

Common commands are:

```shell
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

GitHub Actions runs Biome checks on pushes and Playwright after deployments.
Dockerfiles build production and preview images, which the release workflow
pushes to AWS ECR.
