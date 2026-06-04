# AGENTS.md

Neumann newsroom theme — a fork of Prezly's `theme-nextjs-bea` (Next.js 15 App Router). Package name is still `theme-nextjs-bea`. Heavy brand customization lives alongside the upstream base.

## Commands (pnpm — NOT npm)
Lockfile is `pnpm-lock.yaml`. `package.json` `engines` says npm, but always use **pnpm** (Node 20).

- `pnpm dev` — runs plain `next` on **port 3000** (no port override exists; CLAUDE.md's "3003" is wrong). It will fall back to 3001/3002 if 3000 is taken.
- `pnpm check` — Biome lint + format check (this is the gate, not `lint` alone).
- `pnpm typecheck` — `tsc --noEmit --incremental`.
- `pnpm lint:fix` / `pnpm format:fix` — Biome auto-fix.
- `pnpm build` — production build.
- `pnpm test` — Playwright (`npx playwright test`); see Testing below.
- `pnpm visual:audit:live` / `:local` — screenshot diff tooling (`scripts/visual-audit.ts`, runs via `tsx`).

Quality gate after any change: `pnpm typecheck` → `pnpm check` → `pnpm build`, all clean (warnings OK).

## Verifying UI against the live source
This fork visually mirrors `https://newsroom.neumann.com/`. When matching layout/crop/spacing, measure the live source with Playwright (computed styles + `getBoundingClientRect`) before changing CSS — the source uses responsive `50vh`-style heights and `object-fit: cover`, which are easy to mis-replicate with a fixed `aspect-ratio`.

## Testing
- Tests in `tests/` (`index.spec.ts`). `playwright.config.ts` reads `.env.local` and hits `TESTS_BASE_URL` (default `http://localhost:3000`). A server must be running and `.env.local` populated.
- CI `playwright.yml` only runs on Vercel `deployment_status` events, not on push. Push CI = lint only.

## Environment
Copy `.env.example` → `.env.local`. Required: `PREZLY_ACCESS_TOKEN`, `PREZLY_NEWSROOM_UUID`, `MEILISEARCH_API_KEY`. `PREZLY_THEME_UUID` is preset. `.env.example` lists sample tokens.

## Architecture (non-obvious bits)
- Pages live under `app/[localeCode]/` (the brackets are literal dirs; quote/escape them in shell globs). Server data via `app()` helper in `src/adapters/server/`.
- **`@prezly/theme-kit-nextjs` fetches live `ThemeSettings` from Prezly's backend at runtime and overrides `DEFAULT_THEME_SETTINGS`.** For fork-specific fonts/colors that must stick, hardcode them in `src/modules/Head/components/getCssVariables.ts` and the relevant component, not just in `DEFAULT_THEME_SETTINGS`.
- `next.config.js`: images use a custom Uploadcare loader; SVGs import as React components (`@svgr/webpack`); SCSS variables + mixins are injected globally via `prependData` (don't re-import them). Wrapper chain: `withBundleAnalyzer → withThemeKitConfig → withSentryConfig`. Sentry only enables in production with a DSN and not on Vercel.

## Brand customizations (Neumann)
- Brand defaults are hardcoded in `src/theme-settings.ts` (black bg, orange `#ef7b0b` accent). `Font.FF_UNIT_PRO` is self-hosted from `public/fonts/neumann/` and declared in `src/styles/_fonts.scss`; `getGoogleFontName()` returns `null` for it.
- `custom/` is **flat files** (`NeumannFooter.tsx`, `NeumannCategoriesNav.tsx`, `*.module.scss`) imported via `@/custom/*` — not the deep barrel structure CLAUDE.md describes. `custom/neumann.scss` and `custom/fonts.css` referenced in CLAUDE.md do not exist.
- `middleware.ts` matcher already excludes `fonts/` and `*.woff2?` so self-hosted fonts aren't intercepted — preserve that if editing the matcher.

## SCSS gotchas
- `src/styles/_fonts.scss` must be **CSS-only (no `@use`)**: `prependData` injects `@use` lines at the top of every SCSS file, and `@font-face`/CSS output must come after all `@use`. Putting `@use` in that file breaks the build.
- Biome only checks `app/**`, `src/**`, `custom/**` (see `biome.json`). Files outside those are unlinted.
- TS is strict with `noUnusedLocals`/`noUnusedParameters`. Use the `@/*` path aliases in `tsconfig.json` (e.g. `@/adapters/server`, `@/modules/*`, `@/custom/*`).

## Related instruction files
`CLAUDE.md` (root + `~/.claude/CLAUDE.md`) has broader theme conventions, but several specifics are stale — trust this file and the executable config (package.json, next.config.js, middleware.ts) over CLAUDE.md where they conflict, especially the dev port and `custom/` layout.
