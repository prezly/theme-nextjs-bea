/* eslint-disable @typescript-eslint/no-use-before-define */
import { getShortestLocaleSlug } from '@prezly/theme-kit-core';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { api, configureAppRouter } from '@/theme/server';

import { locale } from './locale';

export async function middleware(request: NextRequest) {
    const router = configureAppRouter();

    const { contentDelivery } = api();

    const languages = await contentDelivery.languages();
    const defaultLocale = (await contentDelivery.defaultLanguage()).locale;

    const { pathname, searchParams } = request.nextUrl;

    const matched = await router.match(pathname, searchParams);

    if (matched) {
        const { params } = matched;

        if ('localeSlug' in params && params.localeSlug) {
            // If there is :localeSlug, and it is resolved to the default newsroom locale -- remove it.
            if (params.localeCode === defaultLocale.code) {
                return NextResponse.redirect(
                    new URL(
                        matched.route.generate({ ...params, localeSlug: undefined } as any),
                        request.nextUrl,
                    ),
                );
            }

            const expectedLocaleSlug = getShortestLocaleSlug(languages, params.localeCode);

            // If there is :localeSlug, and it is not matching the expected shortest locale slug -- redirect.
            if (expectedLocaleSlug && expectedLocaleSlug !== params.localeSlug) {
                return NextResponse.redirect(
                    new URL(
                        matched.route.generate({
                            ...params,
                            localeSlug: expectedLocaleSlug,
                        } as any),
                        request.nextUrl,
                    ),
                );
            }
        }

        return NextResponse.rewrite(
            new URL(matched.route.rewrite(matched.params as any), request.nextUrl),
            {
                headers: withAddedHeaders(request.headers, {
                    [locale.HEADER]: matched.params.localeCode,
                }),
            },
        );
    }

    const possiblyLocaleSlug = pathname.split('/').filter(Boolean)[0] ?? '';
    const localized = await router.match(`/${possiblyLocaleSlug}`, searchParams);

    if (localized) {
        return NextResponse.rewrite(
            new URL(`/${localized.params.localeCode}/404`, request.nextUrl),
            {
                headers: withAddedHeaders(request.headers, {
                    [locale.HEADER]: localized.params.localeCode,
                }),
            },
        );
    }

    return NextResponse.rewrite(new URL(`/${defaultLocale.code}/404`, request.nextUrl), {
        headers: withAddedHeaders(request.headers, {
            [locale.HEADER]: defaultLocale.code,
        }),
    });
}

function withAddedHeaders(headers: Headers, extra: Record<string, string>) {
    const extended = new Headers(headers);
    Object.entries(extra).forEach(([name, value]) => {
        extended.set(name, value);
    });
    return extended;
}
