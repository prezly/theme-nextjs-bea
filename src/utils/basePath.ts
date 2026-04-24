export interface BasePathConfig {
    basePath?: string;
    localeSubdir?: Record<string, string>;
}

const LOCALE_SHAPE = /^[a-z]{2,3}([_-][A-Za-z0-9]{2,4})?$/;

export function parseBasePathConfig(env: {
    THEME_BASE_PATH?: string;
    THEME_LOCALE_SUBDIR?: string;
}): BasePathConfig {
    return {
        basePath: normalizeBasePath(env.THEME_BASE_PATH),
        localeSubdir: parseLocaleSubdirMap(env.THEME_LOCALE_SUBDIR),
    };
}

export function applyBasePath(url: string, config: BasePathConfig, localeCode?: string): string {
    if (!url.startsWith('/')) return url;

    const { basePath } = config;
    const subdir = subdirForLocale(config, localeCode);

    let canonical = url;
    if (basePath && (canonical === basePath || canonical.startsWith(`${basePath}/`))) {
        canonical = canonical.slice(basePath.length) || '/';
    }

    const rebuilt = insertLocaleSubdir(canonical, subdir, localeCode);
    return basePath ? prependBasePath(basePath, rebuilt) : rebuilt;
}

export function applyBasePathAbsolute(
    url: string,
    config: BasePathConfig,
    localeCode?: string,
): string {
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
            segments.splice(1, 1);
            result = `/${segments.join('/')}`;
        } else if (segments.length >= 1 && segments[0] === localeSubdir['*']) {
            segments.shift();
            result = segments.length > 0 ? `/${segments.join('/')}` : '/';
        }
    }

    return result;
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
): string {
    if (!subdir) return canonical;

    const segments = canonical.split('/').filter(Boolean);
    if (segments.length === 0) {
        return `/${subdir}`;
    }

    const firstIsLocale = localeCode ? slugMatchesLocale(segments[0], localeCode) : false;

    if (firstIsLocale) {
        if (segments[1] === subdir) return canonical;
        return `/${[segments[0], subdir, ...segments.slice(1)].join('/')}`;
    }

    if (segments[0] === subdir) return canonical;
    return `/${[subdir, ...segments].join('/')}`;
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
