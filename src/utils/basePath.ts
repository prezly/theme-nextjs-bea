export type LocaleSlugFormat = 'short' | 'iso' | 'iso-lower' | 'code' | 'code-lower';

export interface BasePathConfig {
    basePath?: string;
    localeSubdir?: Record<string, string>;
    localeSlugFormat?: LocaleSlugFormat;
}

const LOCALE_SHAPE = /^[a-z]{2,3}([_-][A-Za-z0-9]{2,4})?$/;
const LOCALE_SLUG_FORMATS: ReadonlySet<LocaleSlugFormat> = new Set([
    'short',
    'iso',
    'iso-lower',
    'code',
    'code-lower',
]);

/**
 * First path segment (after the locale) for routes whose public pattern carries
 * the locale slug, e.g. `(/:localeSlug)/category/:slug`. Everything else served
 * under the subdir is treated as a story-like slug whose public pattern has no
 * locale segment (`story`, `previewStory`, `secretStory` resolve their locale
 * from the slug/uuid). Keep this in sync with `configureAppRouter`.
 */
const LOCALE_AWARE_SEGMENTS: ReadonlySet<string> = new Set([
    'category',
    'tag',
    'media',
    'search',
    'privacy-policy',
    'cookie-policy',
]);

export function parseBasePathConfig(env: {
    THEME_BASE_PATH?: string;
    THEME_LOCALE_SUBDIR?: string;
    THEME_LOCALE_SLUG_FORMAT?: string;
}): BasePathConfig {
    return {
        basePath: normalizeBasePath(env.THEME_BASE_PATH),
        localeSubdir: parseLocaleSubdirMap(env.THEME_LOCALE_SUBDIR),
        localeSlugFormat: parseLocaleSlugFormat(env.THEME_LOCALE_SLUG_FORMAT),
    };
}

/** Whether the newsroom is served under a reverse-proxy path prefix. */
export function isReverseProxyConfigured(config: BasePathConfig): boolean {
    return Boolean(config.basePath || config.localeSubdir);
}

export function formatLocaleSlug(
    localeCode: string,
    format: LocaleSlugFormat | undefined,
): string | undefined {
    if (!format || format === 'short') return undefined;
    const underscore = localeCode;
    const hyphen = localeCode.replace(/_/g, '-');
    switch (format) {
        case 'iso':
            return hyphen;
        case 'iso-lower':
            return hyphen.toLowerCase();
        case 'code':
            return underscore;
        case 'code-lower':
            return underscore.toLowerCase();
    }
}

export function applyBasePath(url: string, config: BasePathConfig, localeCode?: string): string {
    if (!url.startsWith('/')) return url;

    const { basePath, localeSlugFormat } = config;
    const subdir = subdirForLocale(config, localeCode);
    const localeSlug = localeCode ? formatLocaleSlug(localeCode, localeSlugFormat) : undefined;

    let canonical = url;
    if (basePath && (canonical === basePath || canonical.startsWith(`${basePath}/`))) {
        canonical = canonical.slice(basePath.length) || '/';
    }

    const rebuilt = insertLocaleSubdir(canonical, subdir, localeCode, localeSlug);
    return basePath ? prependBasePath(basePath, rebuilt) : rebuilt;
}

export function applyBasePathAbsolute(
    url: string,
    config: BasePathConfig,
    localeCode?: string,
): string {
    if (!config.basePath && !config.localeSubdir && !config.localeSlugFormat) return url;
    try {
        const parsed = new URL(url);
        parsed.pathname = applyBasePath(parsed.pathname || '/', config, localeCode);
        return parsed.toString();
    } catch {
        return url;
    }
}

export function stripBasePath(pathname: string, config: BasePathConfig): string {
    if (!pathname.startsWith('/')) return pathname;

    let result = pathname;

    const { basePath, localeSubdir } = config;
    if (basePath && (result === basePath || result.startsWith(`${basePath}/`))) {
        result = result.slice(basePath.length) || '/';
    }

    if (localeSubdir) {
        const segments = result.split('/').filter(Boolean);

        if (
            segments.length >= 2 &&
            LOCALE_SHAPE.test(segments[0]) &&
            isConfiguredSubdir(segments[0], segments[1], localeSubdir)
        ) {
            // `/<locale>/<subdir>/...` — peel the subdir. Keep the locale for
            // locale-aware routes (IntlMiddleware needs it in the path); drop it for
            // story-like routes whose public pattern has no locale segment (they
            // recover the locale from the slug via `resolveLocale`).
            const locale = segments[0];
            const rest = segments.slice(2);
            if (rest.length === 0 || LOCALE_AWARE_SEGMENTS.has(rest[0])) {
                result = `/${[locale, ...rest].join('/')}`;
            } else {
                result = rest.length > 0 ? `/${rest.join('/')}` : '/';
            }
        } else if (segments.length >= 1 && segments[0] === localeSubdir['*']) {
            segments.shift();
            result = segments.length > 0 ? `/${segments.join('/')}` : '/';
        }
    }

    return result;
}

function parseLocaleSlugFormat(raw: string | undefined): LocaleSlugFormat | undefined {
    if (!raw) return undefined;
    const trimmed = raw.trim();
    return LOCALE_SLUG_FORMATS.has(trimmed as LocaleSlugFormat)
        ? (trimmed as LocaleSlugFormat)
        : undefined;
}

function normalizeBasePath(raw: string | undefined): string | undefined {
    if (!raw) return undefined;
    const trimmed = raw.trim().replace(/\/+$/, '');
    if (!trimmed || trimmed === '/') return undefined;
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function parseLocaleSubdirMap(raw: string | undefined): Record<string, string> | undefined {
    if (!raw) return undefined;
    const map: Record<string, string> = {};
    for (const entry of raw.split(',')) {
        const [key, value] = entry.split(':').map((s) => s.trim());
        if (!key || !value) continue;
        map[key] = value.replace(/^\/+|\/+$/g, '');
    }
    return Object.keys(map).length > 0 ? map : undefined;
}

function subdirForLocale(
    config: BasePathConfig,
    localeCode: string | undefined,
): string | undefined {
    const map = config.localeSubdir;
    if (!map) return undefined;
    if (localeCode) {
        if (map[localeCode]) return map[localeCode];
        const short = localeCode.split(/[-_]/)[0];
        if (map[short]) return map[short];
    }
    return map['*'];
}

function prependBasePath(basePath: string, rest: string): string {
    if (rest === '/') return basePath;
    return `${basePath}${rest}`;
}

function insertLocaleSubdir(
    canonical: string,
    subdir: string | undefined,
    localeCode: string | undefined,
    localeSlug: string | undefined,
): string {
    const segments = canonical.split('/').filter(Boolean);
    const firstIsLocale =
        segments.length > 0 && localeCode ? slugMatchesLocale(segments[0], localeCode) : false;

    if (firstIsLocale) {
        // The locale is already in the URL (locale-aware routes, placed there by
        // theme-kit's `toLocaleSlug`). Insert the subdir right after the locale.
        if (!subdir) return canonical;
        if (segments[1] === subdir) return canonical;
        return `/${[segments[0], subdir, ...segments.slice(1)].join('/')}`;
    }

    // No locale segment in the URL (story-like routes, which resolve their locale
    // from the slug). Prepend the locale slug — only when a slug format is
    // configured — followed by the subdir, as the legacy reverse-proxy themes did.
    const prefix = [localeSlug, subdir].filter(Boolean) as string[];
    if (prefix.length === 0) return canonical;
    if (prefix.every((segment, index) => segments[index] === segment)) return canonical;
    return `/${[...prefix, ...segments].join('/')}`;
}

function slugMatchesLocale(slug: string, localeCode: string): boolean {
    if (slug === localeCode) return true;
    if (slug === localeCode.replace(/_/g, '-')) return true;
    if (slug.toLowerCase() === localeCode.toLowerCase()) return true;
    if (slug.toLowerCase() === localeCode.replace(/_/g, '-').toLowerCase()) return true;
    if (slug === localeCode.split(/[-_]/)[0]) return true;
    if (localeCode === slug.split(/[-_]/)[0]) return true;
    return false;
}

function isConfiguredSubdir(
    slug: string,
    candidate: string,
    localeSubdir: Record<string, string>,
): boolean {
    for (const [key, value] of Object.entries(localeSubdir)) {
        if (value !== candidate) continue;
        if (key === '*' || slugMatchesLocale(slug, key)) return true;
    }
    return false;
}
