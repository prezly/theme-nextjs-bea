'use client';

import { RoutingAdapter } from '@prezly/theme-kit-nextjs';
import { createContext, type ReactNode, useContext } from 'react';

import { applyBasePath, type BasePathConfig } from '@/utils';

import { useLocale } from './locale';

import type { AppRoutes } from '../server/routing';

export type * from '../server/routing';

const { useRouting: baseUseRouting, RoutingContextProvider } = RoutingAdapter.connect<AppRoutes>();

const BasePathContext = createContext<BasePathConfig>({});

export { RoutingContextProvider };

export function BasePathProvider({
    config,
    children,
}: {
    config: BasePathConfig;
    children: ReactNode;
}) {
    return <BasePathContext.Provider value={config}>{children}</BasePathContext.Provider>;
}

export function useRouting() {
    const base = baseUseRouting();
    const config = useContext(BasePathContext);
    const currentLocale = useLocale();

    const generateUrl: typeof base.generateUrl = ((routeName: string, ...rest: unknown[]) => {
        const url = (base.generateUrl as (name: string, ...args: unknown[]) => `/${string}`)(
            routeName,
            ...rest,
        );
        const params = rest[0] as { localeCode?: string } | undefined;
        return applyBasePath(url, config, params?.localeCode ?? currentLocale) as `/${string}`;
    }) as typeof base.generateUrl;

    return { generateUrl };
}
