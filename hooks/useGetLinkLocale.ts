import { useCallback, useMemo } from 'react';

import { toUrlSlug } from '@/utils/locale';
import { getDefaultLanguage } from '@/utils/prezly/api/languages';

import { useCurrentLocale } from './useCurrentLocale';
import { useLanguages } from './useLanguages';

export function useGetLinkLocale() {
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();

    const defaultLanguage = useMemo(() => getDefaultLanguage(languages), [languages]);

    // Determine correct URL for translated stories/categories with a fallback to homepage
    const getLinkLocale = useCallback(
        (localeCode?: string) => {
            // This is mainly used for Language Dropdown
            if (localeCode) {
                // When navigating to default language, we don't append the locale to the URL.
                // Stories also don't need locale, since story slug is unique between languages
                if (localeCode === defaultLanguage.code) {
                    return false;
                }

                return toUrlSlug(localeCode);
            }

            if (defaultLanguage.code === currentLocale) {
                return false;
            }

            return toUrlSlug(currentLocale);
        },
        [defaultLanguage, currentLocale],
    );

    return getLinkLocale;
}
