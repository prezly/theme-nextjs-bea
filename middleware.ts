import { IntlMiddleware } from '@prezly/theme-kit-nextjs/middleware';
import type { NextRequest } from 'next/server';

import { configureAppRouter } from '@/adapters/server';

import { initPrezlyClient } from './adapters/server/prezly';

export async function middleware(request: NextRequest) {
    const { contentDelivery } = initPrezlyClient(request.headers);

    const languages = await contentDelivery.languages();
    const prioritizedLanguages = [...languages].sort(
        (a, b) =>
            -cmp(a.is_default, b.is_default) || // prefer default
            -cmp(a.public_stories_count, b.public_stories_count) || // prefer more used languages
            -cmp(a.code, b.code), // order by code afterward
    );

    const locales = prioritizedLanguages.map((lang) => lang.code);
    const [defaultLocale] = prioritizedLanguages
        .filter((lang) => lang.is_default)
        .map((lang) => lang.code);

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
         * - favicon.ico (favicon file)
         */
        '/((?!robots.txt|api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml).*)',
    ],
};

function cmp(a: boolean, b: boolean): number;
function cmp(a: number, b: number): number;
function cmp(a: string, b: string): number;
function cmp<T extends number | boolean>(a: T, b: T): number {
    if (a === b) return 0;
    return a < b ? -1 : 1;
}
