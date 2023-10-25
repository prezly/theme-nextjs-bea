/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { api } from './api';
import { locale } from './locale';
import { createRouter, route } from './router';

export async function middleware(request: NextRequest) {
    const router = createAppRouter();

    const { contentDelivery } = api();

    const defaultLocale = (await contentDelivery.defaultLanguage()).locale.code;

    const { pathname, searchParams } = request.nextUrl;

    const matched = await router.match(pathname, searchParams);

    if (matched) {
        return NextResponse.rewrite(
            new URL(matched.route.rewrite(matched.params as any), request.nextUrl),
            {
                headers: withAddedHeaders(request.headers, {
                    [locale.HEADER]: matched.params.locale,
                }),
            },
        );
    }

    const localized = await router.match(`/${pathname.split('/')[0]}`, searchParams);

    if (localized) {
        return NextResponse.rewrite(new URL(`/${localized.params.locale}/404`, request.nextUrl), {
            headers: withAddedHeaders(request.headers, {
                [locale.HEADER]: localized.params.locale,
            }),
        });
    }

    return NextResponse.rewrite(new URL(`/${defaultLocale}/404`, request.nextUrl), {
        headers: withAddedHeaders(request.headers, {
            [locale.HEADER]: defaultLocale,
        }),
    });
}

export namespace middleware {
    export const config = {
        matcher: [
            /*
             * Match all request paths except for the ones starting with:
             * - api (API routes)
             * - _next/static (static files)
             * - _next/image (image optimization files)
             * - favicon.ico (favicon file)
             */
            '/',
            '/((?!api|_next/static|_next/image|favicon.ico).*)',
        ],
    };
}

function createAppRouter() {
    const { contentDelivery } = api();

    return createRouter([
        route('/(:localeSlug)', '/:locale'),
        route('(/:localeSlug)/category/:slug', '/:locale/category/:slug'),
        route('(/:localeSlug)/media', '/:locale/media'),
        route('(/:localeSlug)/media/album/:uuid', '/:locale/media/album/:uuid'),
        route('(/:localeSlug)/search', '/:locale/search'),

        route('/s/:uuid', '/:locale/s/:uuid', {
            async resolveImplicitLocale({ uuid }) {
                const story = await contentDelivery.story({ uuid });
                return story?.culture.code;
            },
        }),

        route('/:slug', '/:locale/:slug', {
            async resolveImplicitLocale({ slug }) {
                const story = await contentDelivery.story({ slug });
                return story?.culture.code;
            },
        }),
    ]);
}

function withAddedHeaders(headers: Headers, extra: Record<string, string>) {
    const extended = new Headers(headers);
    Object.entries(extra).forEach(([name, value]) => {
        extended.set(name, value);
    });
    return extended;
}
