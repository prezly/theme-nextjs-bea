'use client';

import type { Locale } from '@prezly/theme-kit-intl';

import { integrateRouting } from '@/theme-kit/client';

import { useLocale } from './locale';

export type * from '../server/routing';

export const { useRouting: useThemeKitRouting, RoutingContextProvider } = integrateRouting();

export function useRouting(locale?: Locale.Code) {
    const currentLocale = useLocale();

    return useThemeKitRouting(locale ?? currentLocale);
}
