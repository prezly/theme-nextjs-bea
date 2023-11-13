import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { matchLanguageByLocaleSlug } from '@prezly/theme-kit-core';

import { type AsyncResolvable, resolveAsync } from '@/theme-kit/resolvable';

import type { Router, RoutesMap } from './types';

interface Configuration {
    languages: AsyncResolvable<
        Pick<NewsroomLanguageSettings, 'code' | 'is_default' | 'public_stories_count'>[]
    >;
}

export function createRouter<Routes extends RoutesMap>(
    routes: Routes,
    config: Configuration,
): Router<Routes> {
    return {
        routes,

        async match(path: string, searchParams: URLSearchParams) {
            async function resolveDefaultLocale() {
                const languages = await resolveAsync(config.languages);
                const defaultLanguage = languages.find((lang) => lang.is_default);
                if (!defaultLanguage) {
                    throw new Error(
                        'It is expected that the languages list always contains a default language.',
                    );
                }
                return defaultLanguage.code;
            }

            async function resolveLocaleSlug(localeSlug: string) {
                const languages = await resolveAsync(config.languages);
                return matchLanguageByLocaleSlug(languages, localeSlug)?.code;
            }

            const matches = await Promise.all(
                Object.values(routes).map(async (route) => {
                    const params = await route.match(path, searchParams, {
                        getDefaultLocale: resolveDefaultLocale,
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
