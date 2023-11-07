import { matchLanguageByLocaleSlug } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';

import { api } from '../api';

import type { Route } from './route';

export type RoutesMap<T extends Route<string, unknown>> = Record<string, T>;

export interface Router<Routes extends RoutesMap<Route<string, unknown>>> {
    routes: Routes;

    match(
        path: string,
        searchParams: URLSearchParams,
    ): {
        [RouteName in keyof Routes]: Routes[RouteName] extends Route<string, infer Match>
            ? Promise<
                  | { params: Match & { localeCode: Locale.Code }; route: Route<string, Match> }
                  | undefined
              >
            : undefined;
    }[keyof Routes];

    generate<RouteName extends keyof Routes>(
        routeName: RouteName,
        ...params: Routes[RouteName] extends Route<string, infer Match>
            ? {} extends Match
                ? [Match] | []
                : [Match]
            : never
    ): string;

    dump(): {
        [RouteName in keyof Routes]: Routes[RouteName]['pattern'];
    };
}

export function createRouter<Routes extends Record<string, Route<string, unknown>>>(
    routes: Routes,
): Router<Routes> {
    return {
        routes,

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
                Object.values(routes).map(async (route) => {
                    const params = await route.match(path, searchParams, {
                        getDefaultLocale,
                        resolveLocaleSlug,
                    });
                    if (params) {
                        return { params, route };
                    }
                    return undefined;
                }),
            );

            const [first] = matches.filter(Boolean);
            return first;
        },

        generate(routeName, params = {}) {
            return routes[routeName].generate(params);
        },

        dump() {
            return Object.fromEntries(
                Object.entries(routes).map(([routeName, route]) => [routeName, route.pattern]),
            );
        },
    } as Router<Routes>;
}