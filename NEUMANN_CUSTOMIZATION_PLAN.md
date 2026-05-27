# Neumann Theme Customization Plan

Living document tracking the visual customization of this Next.js theme to
match the live target at <https://newsroom.neumann.com/>.

> Status: **In progress**. Phases get checked off as they're completed.
> See `VISUAL_AUDIT.md` for the headless-browser tooling that drives the
> visual verification loop.

## Visual target

Source of truth: <https://newsroom.neumann.com/>. Reference screenshots live
in `.scratch/screens/live/` (gitignored, regenerate with `pnpm visual:audit:live`).

### Brand tokens

**Colors**

| Role | Hex |
|------|-----|
| Page background | `#000000` |
| Card / dropdown background | `#2d2d2d` |
| Mobile drawer background | `#1c1c1c` |
| CTA button background | `#141414` |
| Accent / brand orange | `#ef7b0b` |
| Accent hover (lighter) | `#f18823` |
| Accent active (darker) | `#ef7b0a` |
| Body text | `#c1c1c1` |
| Headings / strong text | `#ffffff` |
| Secondary text / dates | `#cccccc` |

**Typography** — FF Unit Pro (300 / 400 / 700), self-hosted.
Body 15px, line-height ~1.5. Sentence case headings. UPPERCASE with
letter-spacing on nav, "Read more", date labels, footer h5.

### Component-level spec (verified from live DOM/CSS)

- **Header** — Black, max-width 1600px container, ~88px tall. Logo left
  (61px desktop / 40px mobile). Right cluster: nav (UPPERCASE: PRESS · STORIES
  · SENNHEISER) → orange search icon → globe + locale label + caret.
  Sticky after `pageYOffset > 110`.
- **Search drawer** — Fixed at top of viewport, full width, 110px desktop /
  60px mobile. `background: rgba(0,0,0,0.85)`, `border-bottom: 3px solid
  #ef7b0b`. Just an input + close button — submits a GET to `/search?query=…`.
  **Replaces the current `<SearchWidget>` modal.**
- **Hero** — Full-bleed image, height `80vh / max 660px` desktop, 500px tablet,
  420px mobile. 25% black overlay on image. Centred translucent box
  `rgba(0,0,0,0.5)`, `padding: 80px 40px`, `max-width: 40vw` desktop. Title
  white ~28–32px, subtitle grey 18px, then `MORE >` button (`#141414` bg, white
  border, hover orange border + text).
- **Story grid** — 3 cols desktop / 2 tablet / 1 mobile. Card `#2d2d2d`, no
  border-radius, image top (square-ish 1.2:1, ~300px tall desktop), content
  area `padding: 32px 24px 76px`. Title sentence case 20px / 1.33. Date
  UPPERCASE 14px `letter-spacing: 2px`. "READ MORE >" UPPERCASE 16/500 chevron.
- **Footer** — 3 columns: **Company / Service & Support / Products**. Centered
  Neumann.Berlin logo + 3 social icons (Facebook / Instagram / YouTube). Bottom
  strip: `© 2018-{year} Georg Neumann GmbH` + 7-item legal menu.
- **Search results page** — "Search results" 32/48px centered with
  `linear-gradient(180deg, #2d2d2d, #000)` top fade. Two-column: results +
  facet sidebar (Category checkboxes only, Year facet deferred).

## Confirmed decisions

| # | Question | Decision |
|---|----------|----------|
| Q1 | `main_site_url` / `main_site_label` source | **Hardcoded for now** (in foundation layer) |
| Q2 | Search drawer fidelity | **A — simple form, GET to /search** (no live results) |
| Q3 | `/search` Year facet | **Defer** — Category facet styling only |
| Q4 | Language selector visual | Style only, no rewrite |
| Q5 | Hero full-bleed enforcement | **Force on** — drop the toggle path |
| Q6 | Hub-mode handling | **Skip** — assume non-hub |

## Architectural decisions

- **D1.** Hardcode Neumann brand values in
  `src/modules/Head/components/getCssVariables.ts` so the Prezly API's live
  `themeSettings` cannot override them. `DEFAULT_THEME_SETTINGS` is also
  updated for type safety / fallback.
- **D2.** Move `custom/fonts/*.{woff,woff2}` to `public/fonts/`. Define
  `@font-face` in a new `src/styles/_fonts.scss` (forwarded from
  `styles.globals.scss`). Update `middleware.ts` matcher to exclude
  `fonts/|.*\\.woff2?$`. Delete `custom/fonts.css` (dead code).
- **D3.** Replace `<SearchWidget>` modal with a new `custom/NeumannSearchDrawer/`
  — fixed top, simple form (Q2 → A). The InstantSearch live-results widget
  is dropped; submitting goes to the existing `/search` page.
- **D4.** Wire the existing `custom/NeumannFooter.tsx` into
  `app/[localeCode]/layout.tsx`, replacing the base `<Footer>`.
- **D5.** Wire the existing `custom/NeumannCategoriesNav.tsx` into
  `src/modules/Header/ui/Header.tsx` instead of `<Categories>`.
- **D6.** Tune story-card visuals via `src/components/StoryCards/*.module.scss`,
  not via global overrides.
- **D7.** Retire `custom/neumann.scss` incrementally once each component is
  properly customized. End state: file deleted, no `@import` in
  `styles.globals.scss`.
- **D8.** Phase 0 must fix the pre-existing TypeScript error in
  `src/modules/Header/Header.tsx:29` so `pnpm typecheck` passes.

## Phasing

### Phase 0 — Pre-existing TS bug fix _(sequential, must be first)_

`src/modules/Header/Header.tsx:29` is missing three required props
(`categories`, `displayedGalleries`, `categoriesLayout`). Pass them through
from data already fetched in the same function. Verify `pnpm typecheck`.

### Phase 1 — Foundation: tokens, fonts, CSS variables _(sequential)_

1. Add `FF_UNIT_PRO` to `Font` enum in `src/theme-settings.ts`. Update
   `getGoogleFontName()` → `null` for it. Set Neumann colors and
   `font: Font.FF_UNIT_PRO` in `DEFAULT_THEME_SETTINGS`.
2. Hardcode Neumann values in `getCssVariables.ts` (D1).
3. Move `custom/fonts/*.{woff,woff2}` → `public/fonts/`.
4. Create `src/styles/_fonts.scss` with `@font-face` declarations.
5. Wire `_fonts.scss` into `src/styles/styles.globals.scss`.
6. Update `middleware.ts` matcher (D2).
7. Delete `custom/fonts.css`.
8. Audit: `pnpm visual:audit:local` → verify base typography + colors.

### Phase 2 — Header _(sequential, depends on Phase 1)_

1. Wire `NeumannCategoriesNav` into `src/modules/Header/ui/Header.tsx` (D5).
2. Hardcode `main_site_url` / `main_site_label` in foundation (Q1).
3. Build `custom/NeumannSearchDrawer/` (D3 + Q2 → A). Replace the modal
   `SearchWidget` rendering in `ui/Header.tsx`.
4. Tune `Header.module.scss` for spacing, colors, sticky behaviour.
5. Style locale switcher to match (Q4).
6. Audit: `pnpm visual:audit:local` → header + mobile drawer.

### Phase 3 — Footer _(parallel sub-agent)_

Sub-agent scope: `app/[localeCode]/layout.tsx`, `custom/NeumannFooter.tsx`,
`custom/NeumannFooter.module.scss`.

1. Diff `custom/NeumannFooter.tsx` against the live footer (column titles,
   links, locale-aware URLs, social icons, legal menu, copyright).
2. Patch discrepancies.
3. Wire it into the layout, replacing base `<Footer>`.
4. Style `NeumannFooter.module.scss` to match the visual spec.
5. Audit: `pnpm visual:audit:local --only=home --no-fullpage`.

### Phase 4 — Story cards & hero _(parallel sub-agent)_

Sub-agent scope: `src/components/StoryCards/**`, possibly small additions to
`src/theme-settings.ts` / `getCssVariables.ts`.

1. `StoryCard.module.scss` → Neumann card spec (image 300px desktop, no
   radius, padding, title casing 20px/1.33, date and read-more styling).
2. `HighlightedStoryCard.module.scss` → hero spec (full-bleed, 80vh max
   660px, 25% overlay, centred well, MORE button).
3. Force `full_width_featured_story: true` (Q5).
4. Audit: `pnpm visual:audit:local --only=home`.

### Phase 5 — Search results page _(parallel sub-agent)_

Sub-agent scope: `src/modules/Search/**`.

1. Page title 32/48px centred, `linear-gradient(180deg, #2d2d2d, #000)` fade.
2. Two-column: results left, facet sidebar right.
3. Style **Category** facet checkboxes (Q3 → defer Year).
4. Audit: `pnpm visual:audit:local --only=search`.

### Phase 6 — Cleanup _(sequential, last)_

1. Incrementally retire sections of `custom/neumann.scss` (D7), verifying
   the visual audit doesn't regress at each step.
2. Best case: delete the file and remove the `@import` from
   `styles.globals.scss`.
3. Full visual audit: `pnpm visual:audit` and a final live-vs-local
   comparison report.
4. Mandatory quality gate: `pnpm typecheck && pnpm check && pnpm build`.

## Sub-agent dispatch model

Phases 3, 4, 5 run **concurrently** as three `general` sub-agents because
their file scopes don't overlap. Each gets a focused brief and an explicit
"do not touch files outside this list" guardrail. They report changed files;
the main thread integrates and runs the quality gate before Phase 6.

Phases 0, 1, 2, 6 run on the main thread (shared infrastructure).

## Per-phase quality gates

Each phase ends with:

1. `pnpm typecheck` — zero errors related to changed files.
2. Scoped `pnpm visual:audit:local --only=…` — read screenshots, verify
   parity against the live target.
3. (Phase 6 only) full `pnpm typecheck && pnpm check && pnpm build`.

Local dev server: started on **port 3003** (never 3000 — that's reserved
for the user) in the background, then shut down after each phase's audit.

## Out of scope

- Touching `app/` directory structure (only `layout.tsx` for footer wiring).
- Modifying Prezly admin / API config.
- `playwright.config.ts` or `tests/index.spec.ts`.
- `next.config.js`.
- Dependency upgrades beyond what's strictly required.
- MCP servers / opencode config.

## Progress log

- [x] Plan written to disk
- [x] Phase 0 — TS bug fix
- [x] Phase 1 — Foundation
- [ ] Phase 2 — Header
- [ ] Phase 3 — Footer (parallel)
- [ ] Phase 4 — Story cards & hero (parallel)
- [ ] Phase 5 — Search results page (parallel)
- [ ] Phase 6 — Cleanup
