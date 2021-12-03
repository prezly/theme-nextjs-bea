import { useCallback } from 'react';

import { toUrlSlug } from '@/utils/locale';
import { getShortestLocaleCode } from '@/utils/prezly/api/languages';

import { useCurrentLocale } from './useCurrentLocale';
import { useLanguages } from './useLanguages';

export function useGetLinkLocale() {
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();

    // Determine correct URL for translated stories/categories with a fallback to homepage
    const getLinkLocale = useCallback(
        (localeCode?: string) => {
            // This is mainly used for Language Dropdown
            if (localeCode) {
                const shortestLocaleCode = getShortestLocaleCode(languages, localeCode);
                // When navigating to default language, we don't append the locale to the URL.
                if (!shortestLocaleCode) {
                    return shortestLocaleCode;
                }

                return toUrlSlug(shortestLocaleCode);
            }

            const shortestCurrentLocaleCode = getShortestLocaleCode(languages, currentLocale);
            // When navigating to default language, we don't append the locale to the URL.
            if (!shortestCurrentLocaleCode) {
                return shortestCurrentLocaleCode;
            }

            return toUrlSlug(shortestCurrentLocaleCode);
        },
        [languages, currentLocale],
    );

    return getLinkLocale;
}
