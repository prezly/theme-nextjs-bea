'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import { RoutingAdapter } from '@prezly/theme-kit-nextjs/adapters/client';

import type { AppRoutes } from '../server/routing';

import { useLocale } from './locale';

export type * from '../server/routing';

export const { useRouting: useThemeKitRouting, RoutingContextProvider } =
    RoutingAdapter.connect<AppRoutes>();

export function useRouting(locale?: Locale.Code) {
    const currentLocale = useLocale();

    return useThemeKitRouting(locale ?? currentLocale);
}
