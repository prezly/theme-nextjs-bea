import type { Locale } from '@prezly/theme-kit-intl';
import UrlPattern from 'url-pattern';

import type { Awaitable, ExtractPathParams } from './types';

export type Route<Match> = {
    match(
        path: string,
        searchParams: URLSearchParams,
        context: MatchContext,
    ): Promise<(Match & { localeCode: Locale.Code }) | undefined>;
    generate(params: Match): string;
    rewrite(params: Match & { localeCode: Locale.Code }): string;
};

export interface Options<Match> {
    check?(match: Match, searchParams: URLSearchParams): boolean;
    resolveImplicitLocale?(match: Match): Awaitable<Locale.Code | undefined>;
}

export interface MatchContext {
    getDefaultLocale(): Awaitable<Locale.Code>;
    resolveLocaleSlug(localeSlug: Locale.AnySlug): Awaitable<Locale.Code | undefined>;
}

export function route<
    Pattern extends `/${string}` | `(/:${string})/${string}`,
    Match extends ExtractPathParams<Pattern>,
>(
    pattern: Pattern,
    rewrite: string,
    { check, resolveImplicitLocale }: Options<Match> = {},
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

            const localeCode =
                matched.localeCode ??
                (await resolveImplicitLocale?.(matched as Match)) ??
                (matched.localeSlug
                    ? await resolveLocaleSlug(matched.localeSlug)
                    : await getDefaultLocale());

            if (!localeCode) {
                return undefined;
            }

            return { ...(matched as Match), localeCode };
        },
        generate(params: Match) {
            return urlPattern.stringify(params);
        },
        rewrite(params: Match & { localeCode: Locale.Code }) {
            return rewritePattern.stringify(params);
        },
    };
}
