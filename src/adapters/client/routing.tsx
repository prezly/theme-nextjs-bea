'use client';

import { Locale, RoutingAdapter } from '@prezly/theme-kit-nextjs';
import { type ComponentProps, createContext, type ReactNode, useContext } from 'react';

import {
    applyBasePath,
    type BasePathConfig,
    formatLocaleSlug,
    type LocaleSlugFormat,
} from '@/utils';

import { useLocale } from './locale';

import type { AppRoutes } from '../server/routing';

export type * from '../server/routing';

const { useRouting: baseUseRouting, RoutingContextProvider: BaseRoutingContextProvider } =
    RoutingAdapter.connect<AppRoutes>();

const BasePathContext = createContext<BasePathConfig>({});

type BaseRoutingContextProviderProps = ComponentProps<typeof BaseRoutingContextProvider>;

/**
 * Wraps the theme-kit RoutingContextProvider so client-side URL generation
 * uses the same locale-slug shape as the server. `toLocaleSlug` is a function
 * (not serializable across the server/client boundary), so we pass the
 * serializable `localeSlugFormat` string and rebuild the callback here.
 */
export function RoutingContextProvider({
    localeSlugFormat,
    ...props
}: Omit<BaseRoutingContextProviderProps, 'toLocaleSlug'> & {
    localeSlugFormat?: LocaleSlugFormat;
}) {
    const toLocaleSlug = localeSlugFormat
        ? (code: Locale.Code) =>
              (formatLocaleSlug(code, localeSlugFormat) ?? code) as Locale.UrlSlug
        : undefined;

    return <BaseRoutingContextProvider {...props} toLocaleSlug={toLocaleSlug} />;
}

export function BasePathProvider({
    config,
    children,
}: {
    config: BasePathConfig;
    children: ReactNode;
}) {
    return <BasePathContext.Provider value={config}>{children}</BasePathContext.Provider>;
}

/**
 * Reverse-proxy config serialized from the server. Lets client components that
 * render backend-provided absolute URLs (e.g. story bookmarks built from
 * `oembed.url`) re-apply the same locale/subdir prefix the theme uses elsewhere.
 */
export function useBasePathConfig(): BasePathConfig {
    return useContext(BasePathContext);
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
