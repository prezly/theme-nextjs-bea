import { Locale } from '@prezly/theme-kit-nextjs';
import { IntlMiddleware } from '@prezly/theme-kit-nextjs/middleware';
import { NextRequest, type NextResponse } from 'next/server';

import { configureAppRouter, initPrezlyClient } from '@/adapters/server';
import { applyBasePath, parseBasePathConfig, stripBasePath } from '@/utils';

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

function readThemePathEnv(header: string | null): {
    THEME_BASE_PATH?: string;
    THEME_LOCALE_SUBDIR?: string;
} {
    const fromHeader = decodeThemeEnvHeader(header);
    return {
        THEME_BASE_PATH: fromHeader.THEME_BASE_PATH ?? process.env.THEME_BASE_PATH,
        THEME_LOCALE_SUBDIR: fromHeader.THEME_LOCALE_SUBDIR ?? process.env.THEME_LOCALE_SUBDIR,
    };
}

function decodeThemeEnvHeader(header: string | null): {
    THEME_BASE_PATH?: string;
    THEME_LOCALE_SUBDIR?: string;
} {
    if (!header) return {};
    let json = header;
    if (header.startsWith('data:')) {
        const commaIdx = header.indexOf(',');
        if (commaIdx === -1) return {};
        const meta = header.slice(5, commaIdx);
        const payload = header.slice(commaIdx + 1);
        if (!meta.includes('application/json')) return {};
        try {
            json = meta.includes('base64') ? atob(payload) : decodeURIComponent(payload);
        } catch {
            return {};
        }
    }
    try {
        const parsed = JSON.parse(json) as Record<string, unknown>;
        if (parsed && typeof parsed === 'object') {
            return {
                THEME_BASE_PATH:
                    typeof parsed.THEME_BASE_PATH === 'string' ? parsed.THEME_BASE_PATH : undefined,
                THEME_LOCALE_SUBDIR:
                    typeof parsed.THEME_LOCALE_SUBDIR === 'string'
                        ? parsed.THEME_LOCALE_SUBDIR
                        : undefined,
            };
        }
    } catch {
        // pass-through
    }
    return {};
}

export async function middleware(request: NextRequest) {
    const config = parseBasePathConfig(readThemePathEnv(request.headers.get('X-Prezly-Env')));

    const originalPathname = request.nextUrl.pathname;
    const strippedPathname = stripBasePath(originalPathname, config);

    let effectiveRequest = request;
    if (strippedPathname !== originalPathname) {
        const nextUrl = request.nextUrl.clone();
        nextUrl.pathname = strippedPathname;
        effectiveRequest = new NextRequest(nextUrl, request);
    }

    const locales =
        parseNewsroomLocalesFromHeaders(request.headers) ??
        (await retrieveNewsroomLocalesFromApi(request.headers));

    const [defaultLocale] = locales; // default is expected to always be the first in the list

    const response = await IntlMiddleware.handle(effectiveRequest, {
        router: configureAppRouter(),
        locales,
        defaultLocale,
    });

    if (strippedPathname !== originalPathname) {
        return reapplyBasePathToRedirect(response, config, effectiveRequest);
    }

    return response;
}

function reapplyBasePathToRedirect(
    response: NextResponse,
    config: ReturnType<typeof parseBasePathConfig>,
    request: NextRequest,
): NextResponse {
    const location = response.headers.get('location');
    if (!location) return response;

    try {
        const locUrl = new URL(location, request.nextUrl);
        if (locUrl.origin !== request.nextUrl.origin) return response;

        const [maybeLocale] = locUrl.pathname.split('/').filter(Boolean);
        locUrl.pathname = applyBasePath(locUrl.pathname, config, maybeLocale);
        response.headers.set('location', locUrl.toString());
    } catch {
        // malformed Location header — leave unchanged
    }

    return response;
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
         */
        '/((?!api|_next/static|_next/image|favicon\\.ico$|sitemap\\.xml$|robots\\.txt$).*)',
    ],
};

function cmp(a: boolean, b: boolean): number;
function cmp(a: number, b: number): number;
function cmp(a: string, b: string): number;
function cmp<T extends number | boolean>(a: T, b: T): number {
    if (a === b) return 0;
    return a < b ? -1 : 1;
}
