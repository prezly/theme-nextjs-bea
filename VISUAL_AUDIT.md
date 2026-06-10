# Visual Audit Workflow

This project supports a headless-browser visual audit workflow so the
assistant can compare the live Neumann newsroom (`https://newsroom.neumann.com`)
against the local dev server pixel-by-pixel and propose concrete styling
fixes.

## How it works

1. A standalone Playwright script (`scripts/visual-audit.ts`) launches headless
   Chromium and navigates to a list of pages on each target.
2. For every (target × viewport × page) combination it writes:
   - a viewport ("above the fold") screenshot, and
   - a full-page screenshot.
3. All screenshots land in `.scratch/screens/` (gitignored) along with a
   `manifest.json` that lists every capture with its URL and metadata.
4. The assistant then reads those PNGs back via its `read` tool — it can see
   the rendered pixels and produce a structural / styling diff report against
   `custom/` and `src/modules/` source.

Visual auditing is **never** committed: the `.scratch/` folder and all
screenshots are ignored by git.

## Targets, viewports, pages

| Targets   | URL                                  |
| --------- | ------------------------------------ |
| `live`    | `https://newsroom.neumann.com`       |
| `local`   | `http://localhost:3003`              |

| Viewport   | Size       |
| ---------- | ---------- |
| `mobile`   | 375 × 812  |
| `tablet`   | 768 × 1024 |
| `desktop`  | 1440 × 900 |

| Page key   | Path                       | Notes                                     |
| ---------- | -------------------------- | ----------------------------------------- |
| `home`     | `/`                        | Middleware redirects to default locale    |
| `press`    | `/category/press`          |                                           |
| `stories`  | `/category/stories`        |                                           |
| `search`   | `/search`                  |                                           |
| `story`    | first story link from home | Slug auto-detected per target             |

The `story` page picks the first non-category, non-locale-only link on the
home page. Live and local newsrooms host different stories — that's expected,
the comparison is for layout & styling, not content.

## Commands

```bash
pnpm visual:audit              # both targets, all viewports, all pages
pnpm visual:audit:live         # only the live newsroom
pnpm visual:audit:local        # only the local dev server (requires pnpm dev)
```

Direct invocation with flags:

```bash
tsx scripts/visual-audit.ts --target=both --only=home,press
tsx scripts/visual-audit.ts --target=local --no-fullpage
```

Flags:

- `--target=live|local|both` (default `both`)
- `--only=key1,key2,...` — restrict to specific page keys (`home`, `press`,
  `stories`, `search`, `story`)
- `--no-fullpage` — skip the heavier full-page screenshots, capture the
  fold-only viewport image. Faster for quick layout iteration.

## First-time setup

```bash
pnpm install                          # tsx is in devDependencies
pnpm exec playwright install chromium # one-time browser binary download
```

The Playwright `@playwright/test` package is already a dependency for the e2e
tests, so no other installs are needed.

## Output layout

```
.scratch/
  README.md
  screens/
    manifest.json
    live/
      mobile/   home.fold.png  home.full.png  press.fold.png  ...
      tablet/   ...
      desktop/  ...
    local/
      mobile/   ...
      tablet/   ...
      desktop/  ...
```

`manifest.json` looks like:

```json
{
    "generatedAt": "2026-05-27T10:00:00.000Z",
    "durationMs": 78321,
    "targets": [...],
    "viewports": [...],
    "pages": ["home", "press", ...],
    "entries": [
        {
            "target": "live",
            "viewport": "desktop",
            "page": "home",
            "url": "https://newsroom.neumann.com/",
            "fullPath": ".scratch/screens/live/desktop/home.full.png",
            "foldPath": ".scratch/screens/live/desktop/home.fold.png",
            "capturedAt": "2026-05-27T10:00:01.123Z"
        }
    ]
}
```

## Typical workflow with the assistant

1. **You** start the dev server in one terminal:
   ```bash
   pnpm dev
   ```
2. **You** ask the assistant to do a visual audit (or a scoped audit, e.g.
   "compare just the headers on desktop").
3. **Assistant** runs the appropriate `pnpm visual:audit*` command.
4. **Assistant** reads `.scratch/screens/manifest.json` and the relevant PNGs.
5. **Assistant** produces a structured comparison report — header, hero,
   story grid, footer, typography, spacing, colors, etc. — with concrete
   proposed code changes scoped to `custom/` and `src/modules/`.
6. **You** approve specific items, **assistant** implements, then re-runs
   the audit to verify.

## What the script handles automatically

- Auto-dismisses common cookie-consent banners (Prezly's `vanilla-cookieconsent`
  IDs `#cm--accept-all` / `#c-p-bn` plus generic patterns).
- Disables CSS transitions / animations / smooth-scroll for stable captures.
- Waits for `networkidle` and `document.fonts.ready` before screenshotting,
  with a small delay for late lazy-loaded images.
- Sets a custom user agent (`PrezlyVisualAudit/1.0`) so live-site analytics can
  be filtered if needed.

## What the script intentionally doesn't do

- **No pixel-diffing / snapshot assertions.** This is a manual review tool,
  not a regression test. Live story content shifts daily — strict diffing
  would be useless here.
- **No CI integration.** The script targets local dev plus a public live
  site; running it on CI adds flakiness with no payoff.
- **No commit of screenshots.** `.scratch/` is gitignored. Re-run as needed.
- **No interactive flows** (clicks, scrolling, hover states beyond what the
  page renders at rest). If we need interaction-state comparisons later we
  can extend the script.

## Extending the audit

To add a new page to capture, append to `PAGES` in `scripts/visual-audit.ts`.
Each entry is either a static path or a `resolve()` function that derives the
path dynamically per target.

To add a new viewport, append to `VIEWPORTS`.

To capture a different live site (e.g. another Sennheiser-group newsroom for
reference), edit the `TARGETS.live.baseUrl` constant or generalise it into an
env variable.

## Troubleshooting

- **"Could not resolve a story slug"** — the home page changed its DOM. Open
  the live site in a normal browser and check the first article-card link;
  adjust the resolver in `PAGES.story.resolve` if needed.
- **Local target times out** — make sure `pnpm dev` is running on port 3003
  before running `pnpm visual:audit:local`.
- **Local screenshots show fonts substituted** — FF Unit Pro fonts in
  `custom/fonts/` must be served correctly. Check the middleware matcher in
  `middleware.ts` excludes static font files.
- **Cookie banner is in screenshots** — add the banner's selector to
  `dismissCookieBanners()` in `scripts/visual-audit.ts`.
