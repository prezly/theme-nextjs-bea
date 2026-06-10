# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Neumann Newsroom Theme**, a customized Next.js 15 theme for the Prezly platform. It's based on the Prezly Bea Theme but heavily customized to match the Neumann brand identity (dark theme, orange accents).

## Commands

```bash
pnpm dev              # Start development server (port 3003)
pnpm build            # Production build
pnpm start            # Start production server
pnpm typecheck        # TypeScript type checking
pnpm check            # Run all Biome checks (lint + format)
pnpm lint:fix         # Fix linting issues
pnpm format:fix       # Fix formatting issues
pnpm test             # Run Playwright tests (requires dev server running)
```

## Architecture

### Data Layer

- **Prezly Theme Kit** (`@prezly/theme-kit-nextjs`): Core data-fetching abstraction for Prezly API
- **`src/adapters/server/`**: Server-side adapters for newsroom data, routing, metadata, analytics
- **`src/adapters/client/`**: Client-side adapters for HTTP, routing, locale, i18n
- **`app()` helper** (`src/adapters/server/app.ts`): Main server-side data access - `app().newsroom()`, `app().story()`, `app().stories()`, etc.

### Routing

- **App Router with locale prefix**: Routes under `app/[localeCode]/`
- **Route definitions**: `src/adapters/server/routing.ts`
- **Middleware** (`middleware.ts`): Locale detection via `IntlMiddleware`

### Key Routes
- `(index)/` - Homepage with story listings
- `(story)/[slug]/` - Individual story pages
- `category/[slug]/` - Category pages
- `media/` - Media gallery pages
- `search/` - Search page

### Neumann Customizations

This theme has been customized for the Neumann brand. Key customization points:

1. **Theme Settings** (`src/theme-settings.ts`): Hardcoded Neumann brand colors and settings
   - Does NOT pull from Prezly API - uses `DEFAULT_THEME_SETTINGS` only
   - Colors: Black background (#000000), orange accent (#ef7b0b), gray text (#c1c1c1)

2. **Custom Font** (`custom/fonts.css` and `custom/fonts/`):
   - FF Unit Pro font (Neumann's brand font) loaded locally
   - Three weights: 300 (light), 400 (regular), 700 (bold)
   - Imported in layout.tsx

3. **Custom SCSS** (`custom/neumann.scss`): Brand-specific style overrides
   - Typography with FF Unit Pro font
   - Card styling with orange titles
   - Navigation styling (uppercase links)
   - Hero image fix for positioning
   - Footer styling
   - Imported in `src/styles/styles.globals.scss`

4. **Custom Header Navigation** (`custom/NeumannCategoriesNav.tsx`):
   - Shows categories as direct links (Press, Stories) instead of dropdown
   - Sennheiser external link configured via `main_site_url` setting

5. **Custom Footer** (`custom/NeumannFooter.tsx`):
   - 3-column layout: Company, Service & Support, Products
   - Matches the original Neumann newsroom footer
   - Copyright and legal links at bottom

6. **Modified Header Component** (`src/modules/Header/ui/Header.tsx`):
   - Uses `NeumannCategoriesNav` instead of default `Categories` component
   - Removed categories bar layout - categories always in header

### Path Aliases

Defined in `tsconfig.json`:
- `@/adapters/server`, `@/adapters/client` - Data layer
- `@/components/*`, `@/modules/*` - UI code
- `@/hooks`, `@/utils`, `@/icons` - Utilities
- `@/custom/*` - Neumann-specific customizations
- `@/theme-settings` - Theme configuration

### Styling

- SCSS Modules with variables in `src/styles/variables/`
- Global SCSS imports auto-prepended via `next.config.js`
- CSS variables generated from theme settings in `src/modules/Head/components/getCssVariables.ts`

### Environment Variables

Required in `.env.local`:
- `PREZLY_ACCESS_TOKEN` - API access token
- `PREZLY_NEWSROOM_UUID` - Newsroom identifier
- `PREZLY_THEME_UUID` - Theme preset identifier (use `73015107-ac86-418b-9120-4ffa439d5c0f`)
- `MEILISEARCH_API_KEY` - For search functionality

## Neumann Brand Colors

| Purpose | Color | Hex |
|---------|-------|-----|
| Background | Black | #000000 |
| Card Background | Dark Gray | #2d2d2d |
| Accent/Links | Orange | #ef7b0b |
| Primary Text | White | #ffffff |
| Secondary Text | Gray | #c1c1c1 |
| Tertiary Text | Light Gray | #cccccc |
