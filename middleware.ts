import { Environment, Locale } from '@prezly/theme-kit-nextjs';
import { IntlMiddleware } from '@prezly/theme-kit-nextjs/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { configureAppRouter, initPrezlyClient } from '@/adapters/server';
import { isNotFoundRewrite, markNotFoundRewrite } from './src/adapters/server/not-found-rewrite';
import {
    isPublicNotFoundCandidate,
    observePublicStoryLookup,
    PUBLIC_NOT_FOUND_HEADER,
    PUBLIC_NOT_FOUND_POLICY,
} from './src/adapters/server/public-not-found-cache';
// Imported directly: the utils barrel would pull Node-only helpers into the
// Edge middleware bundle.
import {
    applyBasePath,
    type BasePathConfig,
    formatLocaleSlug,
    parseBasePathConfig,
    stripBasePath,
} from './src/utils/basePath';

function parseNewsroomLocalesFromHeaders(headers: Headers): Locale.Code[] | undefined {
    const header = headers.get('X-Newsroom-Locales');

    if (!header) {
        return undefined;
    }

    const locales = header
        .split(',')
        .filter(Boolean)
        .map((code) => code.trim())
        .map((code) => Locale.from(code).code);

    if (locales.length === 0) {
        return undefined;
    }

    return locales;
}

async function retrieveNewsroomLocalesFromApi(headers: Headers) {
    const { contentDelivery } = initPrezlyClient(headers);

    const languages = await contentDelivery.languages();
    const prioritizedLanguages = [...languages].sort(
        (a, b) =>
            -cmp(a.is_default, b.is_default) || // prefer default
            -cmp(a.public_stories_count, b.public_stories_count) || // prefer more used languages
            cmp(a.code, b.code), // order by code afterward
    );

    return prioritizedLanguages.map((lang) => lang.code);
}

/**
 * Reverse-proxy path settings, delivered per newsroom in `X-Prezly-Env` (with
 * process env as the fallback, for local development). All empty for a normal
 * newsroom, which leaves every path unchanged.
 */
function readBasePathConfig(headers: Headers): BasePathConfig {
    const env = Environment.combine(process.env, headers.get('X-Prezly-Env')) as Record<
        string,
        unknown
    >;
    const read = (name: string) => (typeof env[name] === 'string' ? env[name] : undefined);

    return parseBasePathConfig({
        THEME_BASE_PATH: read('THEME_BASE_PATH'),
        THEME_LOCALE_SUBDIR: read('THEME_LOCALE_SUBDIR'),
        THEME_LOCALE_SLUG_FORMAT: read('THEME_LOCALE_SLUG_FORMAT'),
    });
}

/**
 * Legacy reverse proxies strip the `/<culture>/news/` prefix and pass the
 * request culture in `X-Prezly-Reverse-Proxy-Culture` instead.
 */
function resolveReverseProxyCulture(
    headers: Headers,
    locales: Locale.Code[],
): Locale.Code | undefined {
    const header = headers.get('X-Prezly-Reverse-Proxy-Culture');
    if (!header) return undefined;
    try {
        const code = Locale.from(header.trim()).code;
        return locales.includes(code) ? code : undefined;
    } catch {
        return undefined;
    }
}

export async function middleware(request: NextRequest) {
    const basePathConfig = readBasePathConfig(request.headers);
    const originalPathname = request.nextUrl.pathname;
    const strippedPathname = stripBasePath(originalPathname, basePathConfig);
    const isPrefixed = strippedPathname !== originalPathname;

    // API calls are tunnelled through the reverse-proxy prefix (the client
    // requests e.g. /<locale>/news/api/stories, a path the customer's proxy
    // forwards). Rewrite them straight to the /api/* handler: IntlMiddleware
    // would treat the unknown route as a 404.
    if (isPrefixed && strippedPathname.startsWith('/api/')) {
        const nextUrl = request.nextUrl.clone();
        nextUrl.pathname = strippedPathname;
        return NextResponse.rewrite(nextUrl);
    }

    let effectiveRequest = request;
    if (isPrefixed) {
        const nextUrl = request.nextUrl.clone();
        nextUrl.pathname = strippedPathname;
        effectiveRequest = new NextRequest(nextUrl, request);
    }

    const locales =
        parseNewsroomLocalesFromHeaders(request.headers) ??
        (await retrieveNewsroomLocalesFromApi(request.headers));

    // The newsroom default is expected to be the first in the list. A locale in
    // the path and story routes' `resolveLocale` still take precedence over the
    // legacy reverse-proxy culture header.
    const defaultLocale = resolveReverseProxyCulture(request.headers, locales) ?? locales[0];

    const { localeSlugFormat } = basePathConfig;
    const toLocaleSlug = localeSlugFormat
        ? (code: Locale.Code) =>
              (formatLocaleSlug(code, localeSlugFormat) ?? code) as Locale.UrlSlug
        : undefined;

    let confirmedNotFound = false;
    let storyRouteMatched = false;
    const eligible = isPublicNotFoundCandidate(effectiveRequest, process.env.PREZLY_MODE);
    const router = configureAppRouter({
        async resolveStoryLocale(slug) {
            storyRouteMatched = true;
            const result = await observePublicStoryLookup((fetch) => {
                const { contentDelivery } = initPrezlyClient(request.headers, {
                    fetch,
                    // Use one stable scope for ALL public-slug middleware lookups,
                    // so eligible and bypassed requests share successful cache entries.
                    // Unobserved/coalesced null results cannot grant the policy.
                    requestScope: PUBLIC_NOT_FOUND_POLICY,
                });
                return contentDelivery.story({ slug });
            });
            confirmedNotFound = eligible && result.confirmedNotFound;
            return result.story?.culture.code;
        },
    });

    const intlResponse = await IntlMiddleware.handle(effectiveRequest, {
        router,
        locales,
        defaultLocale,
        toLocaleSlug,
    });
    // An unmatched path (a rejected slug or a path no route accepts) is
    // rewritten to the `_error404` sentinel. Mark that rewrite so the story
    // page can answer 404 without a lookup; a story slug that is literally
    // `_error404` matched the story route and is left unmarked.
    const response =
        !storyRouteMatched && isNotFoundRewrite(intlResponse)
            ? markNotFoundRewrite(effectiveRequest, intlResponse)
            : intlResponse;
    response.headers.delete(PUBLIC_NOT_FOUND_HEADER);
    if (confirmedNotFound) {
        response.headers.set(PUBLIC_NOT_FOUND_HEADER, PUBLIC_NOT_FOUND_POLICY);
    }
    if (isPrefixed) {
        reapplyBasePathToRedirect(response, basePathConfig, effectiveRequest);
    }
    return response;
}

/** Puts the stripped reverse-proxy prefix back on a same-origin redirect. */
function reapplyBasePathToRedirect(
    response: NextResponse,
    config: BasePathConfig,
    request: NextRequest,
) {
    const location = response.headers.get('location');
    if (!location) return;

    try {
        const url = new URL(location, request.nextUrl);
        if (url.origin !== request.nextUrl.origin) return;

        const [maybeLocale] = url.pathname.split('/').filter(Boolean);
        url.pathname = applyBasePath(url.pathname, config, maybeLocale);
        response.headers.set('location', url.toString());
    } catch {
        // Malformed Location header: leave it unchanged.
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - robots.txt
         * - sitemap.xml
         * - favicon.ico
         *
         * Note: `api` is anchored with `(?:/|$)` so that only the `/api` segment
         * is excluded — without it, story slugs that merely start with "api"
         * (e.g. `/apidya-...`) would bypass the middleware and skip locale
         * rewriting, causing the slug to be treated as a locale code (500).
         */
        '/((?!api(?:/|$)|_next/static|_next/image|favicon\\.ico$|sitemap\\.xml$|robots\\.txt$).*)',
    ],
};

function cmp(a: boolean, b: boolean): number;
function cmp(a: number, b: number): number;
function cmp(a: string, b: string): number;
function cmp<T extends number | boolean>(a: T, b: T): number {
    if (a === b) return 0;
    return a < b ? -1 : 1;
}
