'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';
import UrlPattern from 'url-pattern';

import { normalizeUrl } from '@/theme-kit/integrations/routing/lib/normalizeUrl';

import type { Router, RoutesMap, UrlGenerator } from './types';

export function integrateRouting<Routes extends RoutesMap>() {
    type AppRoutesMap = {
        [RouteName in keyof Routes]: Routes[RouteName]['pattern'];
    };

    const context = createContext<AppRoutesMap | undefined>(undefined);

    function RoutingContextProvider(props: { routes: AppRoutesMap; children: ReactNode }) {
        return <context.Provider value={props.routes}>{props.children}</context.Provider>;
    }

    interface Params {
        localeCode: Locale.Code;
        localeSlug: Locale.UrlSlug;
    }

    function useRouting({ localeCode, localeSlug }: Params) {
        const routes = useContext(context);

        if (!routes) {
            throw new Error(
                '`useRouting()` requires a RoutingContextProvider defined above the tree, but there is no context provided.',
            );
        }

        const generateUrl = useCallback(
            (routeName: keyof Routes, params: any = {}) => {
                const pattern = new UrlPattern(routes[routeName]);

                // FIXME: Check `localeCode` / `localeSlug` shortening logic here
                const href =
                    'localeCode' in params || 'localeSlug' in params
                        ? pattern.stringify(params)
                        : pattern.stringify({ localeCode, localeSlug, ...params });

                return normalizeUrl(href as `/${string}`);
            },
            [routes, localeCode],
        ) as UrlGenerator<Router<Routes>>;

        // @ts-ignore
        return { generateUrl };
    }

    return { useRouting, RoutingContextProvider };
}
