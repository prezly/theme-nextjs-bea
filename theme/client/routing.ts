'use client';

import type { Locale } from '@prezly/theme-kit-intl';

import { useLocale } from '@/theme/client/locale';
import { integrateRouting } from '@/theme-kit/client';

export type * from '../server/routing';

export const { useRouting: useThemeKitRouting, RoutingContextProvider } = integrateRouting();

export function useRouting(locale?: Locale.Code) {
    const currentLocale = useLocale();

    return useThemeKitRouting(locale ?? currentLocale);
}
