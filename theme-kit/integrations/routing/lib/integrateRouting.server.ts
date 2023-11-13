/* eslint-disable @typescript-eslint/no-use-before-define */
import { getShortestLocaleSlug } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';

import { type AsyncResolvable, resolveAsync } from '@/theme-kit/resolvable';

import type { Router, RoutesMap, UrlGenerator } from './types';

interface Configuration {
    locales: Locale.Code[];
    defaultLocale: Locale.Code;
    activeLocale: Locale.Code;
}

export function integrateRouting<Routes extends RoutesMap>(
    createRouter: () => Router<Routes>,
    config: AsyncResolvable<Configuration>,
) {
    async function useRouting(): Promise<{
        router: Router<Routes>;
        generateUrl: UrlGenerator<Router<Routes>>;
    }> {
        const router = createRouter();
        const { locales, defaultLocale, activeLocale } = await resolveAsync(config);

        const languages = locales.map((code) => ({ code, is_default: code === defaultLocale }));

        return {
            router,
            generateUrl(routeName: keyof Routes, params = {}) {
                const localeCode: Locale.Code = (params as any).localeCode ?? activeLocale;
                const localeSlug = getShortestLocaleSlug(languages, localeCode) || undefined;

                // @ts-ignore
                return router.generate(routeName, { localeSlug, ...params });
            },
        };
    }

    return { useRouting };
}
