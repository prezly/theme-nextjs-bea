/**
 * Visual audit script for the Neumann theme.
 *
 * Captures full-page and above-the-fold screenshots of the live Neumann
 * newsroom and the local dev server at multiple breakpoints, so layout/styling
 * parity can be reviewed visually.
 *
 * Run:
 *   pnpm visual:audit                # both targets, all pages
 *   pnpm visual:audit:live           # only the live newsroom
 *   pnpm visual:audit:local          # only local dev (requires `pnpm dev`)
 *   tsx scripts/visual-audit.ts --only=home,press --target=both
 *
 * Output: .scratch/screens/<live|local>/<viewport>/<page>.{full,fold}.png
 *         .scratch/screens/manifest.json
 *
 * See VISUAL_AUDIT.md for the full workflow.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { type Browser, type Page, chromium } from '@playwright/test';

type TargetName = 'live' | 'local';

interface Target {
    name: TargetName;
    baseUrl: string;
}

interface Viewport {
    name: 'mobile' | 'tablet' | 'desktop';
    width: number;
    height: number;
}

interface PageSpec {
    /** Identifier used in filenames and the --only flag. */
    key: string;
    /** Path appended to the target's baseUrl. */
    path: string;
    /**
     * Optional resolver to compute the path dynamically (e.g. picking the
     * latest story slug from the home page).
     */
    resolve?: (page: Page, baseUrl: string) => Promise<string>;
}

interface CliArgs {
    target: 'live' | 'local' | 'both';
    only: string[] | null;
    fullPage: boolean;
}

interface ManifestEntry {
    target: TargetName;
    viewport: Viewport['name'];
    page: string;
    url: string;
    fullPath: string | null;
    foldPath: string;
    capturedAt: string;
}

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, '.scratch', 'screens');

const TARGETS: Record<TargetName, Target> = {
    live: { name: 'live', baseUrl: 'https://newsroom.neumann.com' },
    local: { name: 'local', baseUrl: 'http://localhost:3003' },
};

const VIEWPORTS: Viewport[] = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
];

const PAGES: PageSpec[] = [
    { key: 'home', path: '/' },
    { key: 'press', path: '/category/press' },
    { key: 'stories', path: '/category/stories' },
    { key: 'search', path: '/search' },
    {
        key: 'story',
        path: '/',
        async resolve(page, baseUrl) {
            await page.goto(baseUrl, { waitUntil: 'networkidle' });
            // Pick the first article-card link that looks like a story slug
            // (not /category/, /search, /tag/, etc.)
            const slug = await page.evaluate(() => {
                const anchors = Array.from(
                    document.querySelectorAll<HTMLAnchorElement>('a[href]'),
                );
                const blocked = ['/category/', '/tag/', '/search', '/media', '/feed'];
                for (const a of anchors) {
                    const url = new URL(a.href, location.origin);
                    if (url.origin !== location.origin) continue;
                    const path = url.pathname.replace(/\/+$/, '');
                    if (!path || path === '/') continue;
                    // Strip locale prefix like /en or /en-us
                    const stripped = path.replace(/^\/[a-z]{2}(-[a-z]{2})?(?=\/|$)/i, '');
                    if (!stripped || stripped === '/') continue;
                    if (blocked.some((b) => stripped.startsWith(b))) continue;
                    if (stripped.split('/').length !== 2) continue; // top-level slug only
                    return stripped;
                }
                return null;
            });
            if (!slug) {
                throw new Error(`Could not resolve a story slug from ${baseUrl}`);
            }
            return slug;
        },
    },
];

function parseArgs(argv: string[]): CliArgs {
    const args: CliArgs = { target: 'both', only: null, fullPage: true };
    for (const arg of argv.slice(2)) {
        if (arg.startsWith('--target=')) {
            const value = arg.slice('--target='.length);
            if (value === 'live' || value === 'local' || value === 'both') {
                args.target = value;
            } else {
                throw new Error(`Invalid --target: ${value}`);
            }
        } else if (arg.startsWith('--only=')) {
            args.only = arg
                .slice('--only='.length)
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
        } else if (arg === '--no-fullpage') {
            args.fullPage = false;
        } else if (arg === '--help' || arg === '-h') {
            console.log(
                'Usage: tsx scripts/visual-audit.ts ' +
                    '[--target=live|local|both] [--only=home,press,...] [--no-fullpage]',
            );
            process.exit(0);
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }
    return args;
}

async function dismissCookieBanners(page: Page): Promise<void> {
    // Common selectors for cookie consent on Prezly newsrooms + general patterns.
    const selectors = [
        '#cm--accept-all',
        '#c-p-bn',
        'button[aria-label*="Accept" i]',
        'button:has-text("Accept all")',
        'button:has-text("Accept All")',
        'button:has-text("I agree")',
        '.cc-accept-all',
        '.cookie-accept',
    ];
    for (const sel of selectors) {
        try {
            const el = page.locator(sel).first();
            if (await el.isVisible({ timeout: 250 })) {
                await el.click({ timeout: 1000 });
                await page.waitForTimeout(300);
                return;
            }
        } catch {
            /* ignore and try next selector */
        }
    }
}

async function disableAnimations(page: Page): Promise<void> {
    await page.addStyleTag({
        content: `
            *, *::before, *::after {
                transition-duration: 0s !important;
                transition-delay: 0s !important;
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                scroll-behavior: auto !important;
            }
        `,
    });
}

async function ensureDir(filePath: string): Promise<void> {
    await mkdir(dirname(filePath), { recursive: true });
}

async function captureOne(
    browser: Browser,
    target: Target,
    viewport: Viewport,
    spec: PageSpec,
    fullPage: boolean,
): Promise<ManifestEntry | null> {
    const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        ignoreHTTPSErrors: true,
        userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Chrome/124.0.0.0 Safari/537.36 PrezlyVisualAudit/1.0',
    });
    const page = await context.newPage();
    try {
        let path = spec.path;
        if (spec.resolve) {
            path = await spec.resolve(page, target.baseUrl);
        }
        const url = new URL(path, target.baseUrl).toString();

        const response = await page.goto(url, {
            waitUntil: 'networkidle',
            timeout: 45_000,
        });
        if (!response || !response.ok()) {
            console.warn(
                `  ! ${target.name}/${viewport.name}/${spec.key} -> ${response?.status() ?? 'no response'}`,
            );
            return null;
        }

        await dismissCookieBanners(page);
        await disableAnimations(page);
        // Allow late web-fonts and lazy images to settle.
        await page.waitForTimeout(800);
        try {
            await page.evaluate(async () => {
                if ('fonts' in document) {
                    await (document as Document & { fonts: { ready: Promise<unknown> } })
                        .fonts.ready;
                }
            });
        } catch {
            /* font readiness is best-effort */
        }

        const dir = join(OUT_DIR, target.name, viewport.name);
        const foldPath = join(dir, `${spec.key}.fold.png`);
        const fullPath = fullPage ? join(dir, `${spec.key}.full.png`) : null;

        await ensureDir(foldPath);
        await page.screenshot({ path: foldPath, fullPage: false });
        if (fullPath) {
            await page.screenshot({ path: fullPath, fullPage: true });
        }

        console.log(`  ✓ ${target.name}/${viewport.name}/${spec.key} <- ${url}`);

        return {
            target: target.name,
            viewport: viewport.name,
            page: spec.key,
            url,
            fullPath: fullPath ? toRelative(fullPath) : null,
            foldPath: toRelative(foldPath),
            capturedAt: new Date().toISOString(),
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`  ! ${target.name}/${viewport.name}/${spec.key} -> ${message}`);
        return null;
    } finally {
        await context.close();
    }
}

function toRelative(absolute: string): string {
    return absolute
        .replace(`${ROOT}\\`, '')
        .replace(`${ROOT}/`, '')
        .split('\\')
        .join('/');
}

async function main(): Promise<void> {
    const args = parseArgs(process.argv);

    const targets: Target[] =
        args.target === 'both'
            ? [TARGETS.live, TARGETS.local]
            : [TARGETS[args.target]];

    const pages = args.only
        ? PAGES.filter((p) => args.only?.includes(p.key))
        : PAGES;

    if (pages.length === 0) {
        throw new Error(`No matching pages for --only=${args.only?.join(',') ?? ''}`);
    }

    console.log('Visual audit starting');
    console.log(`  targets:   ${targets.map((t) => t.name).join(', ')}`);
    console.log(`  viewports: ${VIEWPORTS.map((v) => v.name).join(', ')}`);
    console.log(`  pages:     ${pages.map((p) => p.key).join(', ')}`);
    console.log(`  fullPage:  ${args.fullPage}`);
    console.log('');

    const browser = await chromium.launch({ headless: true });
    const manifest: ManifestEntry[] = [];
    const startedAt = Date.now();

    try {
        for (const target of targets) {
            console.log(`[${target.name}] ${target.baseUrl}`);
            for (const viewport of VIEWPORTS) {
                for (const spec of pages) {
                    const entry = await captureOne(
                        browser,
                        target,
                        viewport,
                        spec,
                        args.fullPage,
                    );
                    if (entry) manifest.push(entry);
                }
            }
            console.log('');
        }
    } finally {
        await browser.close();
    }

    const manifestPath = join(OUT_DIR, 'manifest.json');
    await ensureDir(manifestPath);
    await writeFile(
        manifestPath,
        `${JSON.stringify(
            {
                generatedAt: new Date().toISOString(),
                durationMs: Date.now() - startedAt,
                targets: targets.map((t) => ({ name: t.name, baseUrl: t.baseUrl })),
                viewports: VIEWPORTS,
                pages: pages.map((p) => p.key),
                entries: manifest,
            },
            null,
            2,
        )}\n`,
        'utf8',
    );

    console.log(`Done. ${manifest.length} screenshots written to ${toRelative(OUT_DIR)}`);
    console.log(`Manifest: ${toRelative(manifestPath)}`);
}

main().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
});
