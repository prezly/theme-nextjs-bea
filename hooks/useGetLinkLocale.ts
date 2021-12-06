import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { useCallback } from 'react';

import { toUrlSlug } from '@/utils/locale';
import { getShortestLocaleCode } from '@/utils/prezly/api/languages';

import { useCurrentLocale } from './useCurrentLocale';
import { useLanguages } from './useLanguages';

// Determine correct locale for the link (trying to shorten the locale code if possible)
function getLinkLocale(languages: NewsroomLanguageSettings[], localeCode: string) {
    const shortestLocaleCode = getShortestLocaleCode(languages, localeCode);
    // When navigating to default language, we don't append the locale to the URL.
    if (!shortestLocaleCode) {
        return shortestLocaleCode;
    }

    return toUrlSlug(shortestLocaleCode);
}

export function useGetLinkLocale() {
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();

    // The `localeCode` is mainly used for Language Dropdown
    return useCallback(
        (localeCode?: string) => getLinkLocale(languages, localeCode || currentLocale),
        [languages, currentLocale],
    );
}
