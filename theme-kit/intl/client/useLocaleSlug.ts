'use client';

import { getShortestLocaleSlug } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';

import { useIntl } from './context';

export function useLocaleSlug(localeCode?: Locale.AnyCode): Locale.AnySlug | false {
    const { locale, locales, defaultLocale } = useIntl();

    const languages = locales.map((code) => ({ code, is_default: code === defaultLocale }));

    return getShortestLocaleSlug(languages, localeCode ?? locale);
}
