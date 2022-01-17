import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { useCallback } from 'react';

import { LocaleObject } from '@/utils';
import { getShortestLocaleCode } from '@/utils/prezly/api';

import { useCurrentLocale } from './useCurrentLocale';
import { useLanguages } from './useLanguages';

// Determine correct locale slug for the link (trying to shorten the locale code if possible)
function getLinkLocaleSlug(
    languages: NewsroomLanguageSettings[],
    locale: LocaleObject,
): string | false {
    const shortestLocaleCode = getShortestLocaleCode(languages, locale);
    // When navigating to default language, we don't append the locale to the URL.
    if (!shortestLocaleCode) {
        return shortestLocaleCode;
    }

    return LocaleObject.fromAnyCode(shortestLocaleCode).toUrlSlug();
}

export function useGetLinkLocaleSlug() {
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();

    // The `locale` parameter is mainly used for Language Dropdown
    return useCallback(
        (locale?: LocaleObject) => getLinkLocaleSlug(languages, locale || currentLocale),
        [languages, currentLocale],
    );
}
