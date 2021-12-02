import { useCallback, useMemo } from 'react';

import { toSlug, toUrlSlug } from '@/utils/locale';
import { getDefaultLanguage } from '@/utils/prezly/api/languages';

import { useCurrentLocale } from './useCurrentLocale';
import { useLanguages } from './useLanguages';

export function useGetLinkLocale() {
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();

    const defaultLanguage = useMemo(() => getDefaultLanguage(languages), [languages]);

    // Determine correct URL for translated stories/categories with a fallback to homepage
    const getLinkLocale = useCallback(
        (localeSlug?: string | false | undefined) => {
            if (localeSlug) {
                // When navigating to default language, we don't append the locale to the URL.
                // Stories also don't need locale, since story slug is unique between languages
                if (localeSlug === toSlug(defaultLanguage.code)) {
                    return false;
                }

                return toUrlSlug(localeSlug);
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
