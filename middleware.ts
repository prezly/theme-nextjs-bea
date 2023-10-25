/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { api, locale } from '@/theme-kit';

import createAppRouter from './app/router';

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

export const middleware = async (request: NextRequest) => {
    const router = createAppRouter();

    const { contentDelivery } = api();

    const defaultLocale = (await contentDelivery.defaultLanguage()).locale.code;

    const { pathname, searchParams } = request.nextUrl;

    const matched = await router.match(pathname, searchParams);

    if (matched) {
        return NextResponse.rewrite(
            new URL(matched.route.rewrite(matched.params), request.nextUrl),
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
};

function withAddedHeaders(headers: Headers, extra: Record<string, string>) {
    const extended = new Headers(headers);
    Object.entries(extra).forEach(([name, value]) => {
        extended.set(name, value);
    });
    return extended;
}
