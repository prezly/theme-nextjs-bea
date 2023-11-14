/* eslint-disable @typescript-eslint/no-use-before-define */
import { getShortestLocaleSlug } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { type AsyncResolvable, resolveAsync } from '@/theme-kit/resolvable';
import type { Router, RoutesMap } from '@/theme-kit/types';

interface Configuration {
    locales: AsyncResolvable<Locale.Code[]>;
    defaultLocale: AsyncResolvable<Locale.Code>;
}

export const LOCALE_HEADER = 'X-Prezly-Locale';

export function getLocaleFromHeader(): Locale.Code {
    const code = headers().get(LOCALE_HEADER);

    if (!code) {
        console.error(
            'Locale header is not set. Please check if the middleware is configured properly.',
        );
    }

    // Validate and return
    return Locale.from(code || 'en').code;
}

export function createIntlMiddleware<R extends RoutesMap>(
    createRouter: () => Router<R>,
    config: Configuration,
) {
    return async (request: NextRequest) => {
        const router = createRouter();

        const [locales, defaultLocale] = await Promise.all([
            resolveAsync(config.locales),
            resolveAsync(config.defaultLocale),
        ]);

        const { pathname, searchParams } = request.nextUrl;

        const matched = await router.match(pathname, searchParams);

        if (matched) {
            const { params } = matched;

            if ('localeSlug' in params && params.localeSlug) {
                // If there is :localeSlug, and it is resolved to the default newsroom locale -- remove it.
                if (params.localeCode === defaultLocale) {
                    return NextResponse.redirect(
                        new URL(
                            matched.route.generate({ ...params, localeSlug: undefined } as any),
                            request.nextUrl,
                        ),
                    );
                }

                const languages = locales.map((code) => ({
                    code,
                    is_default: code === defaultLocale,
                }));
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
                        [LOCALE_HEADER]: matched.params.localeCode,
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
                        [LOCALE_HEADER]: localized.params.localeCode,
                    }),
                },
            );
        }

        return NextResponse.rewrite(new URL(`/${defaultLocale}/404`, request.nextUrl), {
            headers: withAddedHeaders(request.headers, {
                [LOCALE_HEADER]: defaultLocale,
            }),
        });
    };
}

function withAddedHeaders(current: Headers, extra: Record<string, string>) {
    const extended = new Headers(current);
    Object.entries(extra).forEach(([name, value]) => {
        extended.set(name, value);
    });
    return extended;
}
