'use client';

import { integrateRouting } from '@/theme-kit/client';

import { useIntl, useLocaleSlug } from './intl';

export type * from '../server/routing';

export const { useRouting: useThemeKitRouting, RoutingContextProvider } = integrateRouting();

export function useRouting() {
    const { locale } = useIntl();
    const localeSlug = useLocaleSlug(locale);

    return useThemeKitRouting({
        localeCode: locale,
        localeSlug: localeSlug || '',
    });
}
