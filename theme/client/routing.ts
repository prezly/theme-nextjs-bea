'use client';

import { useLocale } from '@/theme/client/locale';
import { integrateRouting } from '@/theme-kit/client';

import { useLocaleSlug } from './intl';

export type * from '../server/routing';

export const { useRouting: useThemeKitRouting, RoutingContextProvider } = integrateRouting();

export function useRouting() {
    const localeCode = useLocale();
    const localeSlug = useLocaleSlug(localeCode);

    return useThemeKitRouting({
        localeCode,
        localeSlug: localeSlug || '',
    });
}
