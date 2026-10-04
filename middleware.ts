import { Locale } from '@prezly/theme-kit-nextjs';
import { IntlMiddleware } from '@prezly/theme-kit-nextjs/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { configureAppRouter, initPrezlyClient } from '@/adapters/server';
import { isNotFoundRewrite, markNotFoundRewrite } from './src/adapters/server/not-found-rewrite';
import {
    isPublicNotFoundCandidate,
    observePublicStoryLookup,
    PUBLIC_NOT_FOUND_HEADER,
    PUBLIC_NOT_FOUND_POLICY,
} from './src/adapters/server/public-not-found-cache';

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
    let locales = parseNewsroomLocalesFromHeaders(request.headers);

    if (!locales) {
        try {
            locales = await retrieveNewsroomLocalesFromApi(request.headers);
        } catch {
            return new NextResponse('Newsroom is temporarily unavailable.', { status: 503 });
        }
    }

    const [defaultLocale] = locales; // default is expected to always be the first in the list

    let confirmedNotFound = false;
    let storyRouteMatched = false;
    const eligible = isPublicNotFoundCandidate(request, process.env.PREZLY_MODE);
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

    const intlResponse = await IntlMiddleware.handle(request, {
        router,
        locales,
        defaultLocale,
    });
    // An unmatched path (a rejected slug or a path no route accepts) is
    // rewritten to the `_error404` sentinel. Mark that rewrite so the story
    // page can answer 404 without a lookup; a story slug that is literally
    // `_error404` matched the story route and is left unmarked.
    const response =
        !storyRouteMatched && isNotFoundRewrite(intlResponse)
            ? markNotFoundRewrite(request, intlResponse)
            : intlResponse;
    response.headers.delete(PUBLIC_NOT_FOUND_HEADER);
    if (confirmedNotFound) {
        response.headers.set(PUBLIC_NOT_FOUND_HEADER, PUBLIC_NOT_FOUND_POLICY);
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
