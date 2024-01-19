import { Locale } from '@prezly/theme-kit-nextjs';
import { IntlMiddleware } from '@prezly/theme-kit-nextjs/middleware';
import type { NextRequest } from 'next/server';

import { configureAppRouter } from '@/adapters/server';

import { initPrezlyClient } from './adapters/server/prezly';

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

export async function middleware(request: NextRequest) {
    const locales =
        parseNewsroomLocalesFromHeaders(request.headers) ??
        (await retrieveNewsroomLocalesFromApi(request.headers));

    const [defaultLocale] = locales; // default is expected to always be the first in the list

    return IntlMiddleware.handle(request, {
        router: configureAppRouter(),
        locales,
        defaultLocale,
    });
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
