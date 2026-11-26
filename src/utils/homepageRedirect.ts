import { type Locale, Routing } from '@prezly/theme-kit-nextjs';
import { NextResponse } from 'next/server';

/**
 * Crisis mode (Prezly P-DEV-1175): while it is on, the app sends a map from each
 * of the site's locale codes to a URL on the live site, in `X-Prezly-Env`:
 *
 *     THEME_HOMEPAGE_REDIRECTS={"en":"https://live.example.com/","nl_BE":"https://live.example.com/nl"}
 *
 * Only the homepage and its language versions (`/`, `/nl`, `/fr-be`) redirect.
 * Stories, categories and every other page keep working. The app decides every
 * target (language matching, the live site's URLs); this file only looks it up.
 */
export const HOMEPAGE_REDIRECTS_ENV = 'THEME_HOMEPAGE_REDIRECTS';

type HomepageRedirects = Partial<Record<string, string>>;

/** The redirect map, or `undefined` when crisis mode is off or the value is unusable. */
export function parseHomepageRedirects(value: unknown): HomepageRedirects | undefined {
    let parsed = value;
    if (typeof value === 'string') {
        if (value.trim() === '') return undefined;
        try {
            parsed = JSON.parse(value);
        } catch {
            return undefined;
        }
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return undefined;
    }

    const redirects: HomepageRedirects = {};
    for (const [code, url] of Object.entries(parsed as Record<string, unknown>)) {
        if (typeof url === 'string' && isHttpUrl(url)) {
            redirects[code] = url;
        }
    }
    return Object.keys(redirects).length > 0 ? redirects : undefined;
}

/**
 * Where a homepage request goes, or `undefined` when the path is not a homepage
 * (or its language has no target). `pathname` is the path without any
 * reverse-proxy base path.
 */
export function resolveHomepageRedirect(
    pathname: string,
    context: {
        redirects: HomepageRedirects;
        locales: Locale.Code[];
        defaultLocale: Locale.Code;
    },
): string | undefined {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
        return context.redirects[context.defaultLocale];
    }
    if (segments.length > 1) {
        return undefined;
    }

    const [segment] = segments as [string];
    const locale = Routing.matchLocaleSlug(segment as Locale.AnySlug, context.locales);
    return locale ? context.redirects[locale] : undefined;
}

/**
 * A temporary redirect that nothing caches: crisis mode is switched off again,
 * and the homepage has to come back at once. Campaign parameters are kept, so
 * analytics still see where visitors came from.
 */
export function homepageRedirectResponse(target: string, requestUrl: URL): NextResponse {
    const url = new URL(target);
    requestUrl.searchParams.forEach((value, name) => {
        if (name.startsWith('utm_') && !url.searchParams.has(name)) {
            url.searchParams.append(name, value);
        }
    });

    const response = NextResponse.redirect(url, 302);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
}

function isHttpUrl(value: string): boolean {
    try {
        const { protocol } = new URL(value);
        return protocol === 'https:' || protocol === 'http:';
    } catch {
        return false;
    }
}
