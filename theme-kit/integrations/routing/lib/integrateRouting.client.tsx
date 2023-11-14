'use client';

import { getShortestLocaleSlug } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';
import UrlPattern from 'url-pattern';

import { normalizeUrl } from '@/theme-kit/integrations/routing/lib/normalizeUrl';
import { withoutUndefined } from '@/utils';

import type { Router, RoutesMap, UrlGenerator } from './types';

export function integrateRouting<Routes extends RoutesMap>() {
    type AppRoutesMap = {
        [RouteName in keyof Routes]: Routes[RouteName]['pattern'];
    };

    interface Context {
        routes: AppRoutesMap;
        locales: Locale.Code[];
        defaultLocale: Locale.Code;
    }

    const context = createContext<Context | undefined>(undefined);

    function RoutingContextProvider(props: Context & { children: ReactNode }) {
        const { children, ...value } = props;
        return <context.Provider value={value}>{props.children}</context.Provider>;
    }

    function useRouting(activeLocale: Locale.Code) {
        const value = useContext(context);

        if (!value) {
            throw new Error(
                '`useRouting()` requires a RoutingContextProvider defined above the tree, but there is no context provided.',
            );
        }

        const { routes, locales, defaultLocale } = value;

        const languages = useMemo(
            () => locales.map((code) => ({ code, is_default: code === defaultLocale })),
            [locales, defaultLocale],
        );

        const generateUrl = useCallback(
            (routeName: keyof Routes, params: any = {}) => {
                const pattern = new UrlPattern(routes[routeName]);

                const localeCode: Locale.Code = params.localeCode ?? activeLocale;
                const localeSlug: Locale.AnySlug =
                    params.localeSlug ?? getShortestLocaleSlug(languages, localeCode);

                const href = pattern.stringify({
                    localeCode,
                    localeSlug,
                    ...withoutUndefined(params),
                });

                return normalizeUrl(href as `/${string}`);
            },
            [routes, languages, activeLocale],
        ) as UrlGenerator<Router<Routes>>;

        // @ts-ignore
        return { generateUrl };
    }

    return { useRouting, RoutingContextProvider };
}
