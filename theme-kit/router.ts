/* eslint-disable @typescript-eslint/no-use-before-define,@typescript-eslint/naming-convention */
import 'server-only';

import { matchLanguageByLocaleSlug } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import UrlPattern from 'url-pattern';

import { api } from './api';

type Route<Match> = {
    match(
        path: string,
        searchParams: URLSearchParams,
        context: RouteMatchContext,
    ): Promise<(Match & { locale: Locale.Code }) | undefined>;
    rewrite(params: Match & { locale: Locale.Code }): string;
};

interface RouteOptions<Match> {
    check?(match: Match, searchParams: URLSearchParams): boolean;
    resolveImplicitLocale?(match: Match): OptionalPromise<Locale.Code | undefined>;
}

interface RouteMatchContext {
    getDefaultLocale(): OptionalPromise<Locale.Code>;
    resolveLocaleSlug(localeSlug: Locale.AnySlug): OptionalPromise<Locale.Code | undefined>;
}

export function createRouter<T extends Route<unknown>>(routes: T[]) {
    return {
        async match(path: string, searchParams: URLSearchParams) {
            const { contentDelivery } = api();

            async function getDefaultLocale() {
                return (await contentDelivery.defaultLanguage()).locale.code;
            }

            async function resolveLocaleSlug(localeSlug: string) {
                const languages = await contentDelivery.languages();
                return matchLanguageByLocaleSlug(languages, localeSlug)?.locale.code;
            }

            const matches = await Promise.all(
                routes.map(async (r) => {
                    const params = await r.match(path, searchParams, {
                        getDefaultLocale,
                        resolveLocaleSlug,
                    });
                    if (params) {
                        return { params, route: r };
                    }
                    return undefined;
                }),
            );

            const [first] = matches.filter(Boolean);

            return first;
        },
    };
}

export function route<
    Pattern extends `/${string}` | `(/:${string})/${string}`,
    Match extends ExtractPathParams<Pattern>,
>(
    pattern: Pattern,
    rewrite: string,
    { check, resolveImplicitLocale }: RouteOptions<Match> = {},
): Route<Match> {
    const urlPattern = new UrlPattern(pattern);
    const rewritePattern = new UrlPattern(rewrite);

    return {
        async match(
            path: string,
            searchParams: URLSearchParams,
            { getDefaultLocale, resolveLocaleSlug },
        ) {
            const matched: Record<string, string | undefined> = urlPattern.match(path);

            if (!matched) {
                return undefined;
            }

            if (check && !check(matched as Match, searchParams)) {
                return undefined;
            }

            const locale =
                matched.locale ??
                (await resolveImplicitLocale?.(matched as Match)) ??
                (matched.localeSlug
                    ? await resolveLocaleSlug(matched.localeSlug)
                    : await getDefaultLocale());

            if (!locale) {
                return undefined;
            }

            return { ...(matched as Match), locale };
        },
        rewrite(params: Match & { locale: Locale.Code }) {
            return rewritePattern.stringify(params);
        },
    };
}

type ExtractPathParams<T extends string> =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T extends `${infer _Start}(/:${infer Param})/${infer Rest}`
        ? { [k in Param]?: string } & ExtractPathParams<Rest>
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}(:${infer Param})/${infer Rest}`
        ? { [k in Param]?: string } & ExtractPathParams<Rest>
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? { [k in Param]: string } & ExtractPathParams<Rest>
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}(/:${infer Param})`
        ? { [k in Param]?: string }
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}(:${infer Param})`
        ? { [k in Param]?: string }
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}:${infer Param}`
        ? { [k in Param]: string }
        : Record<string, never>;

type OptionalPromise<T> = T | Promise<T> | PromiseLike<T>;
