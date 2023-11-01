import { matchLanguageByLocaleSlug } from '@prezly/theme-kit-core';

import { api } from '../api';

import type { Route } from './route';

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
