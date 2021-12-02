import { NewsroomLanguageSettings } from '@prezly/sdk';

import {
    DUMMY_DEFAULT_LOCALE,
    fromSlug,
    toNeutralLanguageCode,
    toRegionCode,
} from '@/utils/locale';

export function getDefaultLanguage(languages: NewsroomLanguageSettings[]) {
    return languages.find(({ is_default }) => is_default) || languages[0];
}

export function getUsedLanguages(languages: NewsroomLanguageSettings[]) {
    return languages.filter((language) => language.stories_count > 0);
}

function getLanguageByExactLocaleCode(languages: NewsroomLanguageSettings[], localeCode: string) {
    return languages.find(({ code }) => code === localeCode);
}

// See https://github.com/prezly/prezly/blob/master/lib/model/CulturePeer.php#L123
function getLanguageByNeutralLocaleCode(languages: NewsroomLanguageSettings[], localeCode: string) {
    const neutralLanguageCode = toNeutralLanguageCode(localeCode);

    // Prefer default language
    const defaultLanguage = getDefaultLanguage(languages);
    if (defaultLanguage.code === localeCode) {
        return defaultLanguage;
    }

    // Try to look in used cultures first (giving priority to used ones)
    const usedLanguages = getUsedLanguages(languages);
    const usedLanguage = usedLanguages.find(
        ({ code }) =>
            toNeutralLanguageCode(code) === neutralLanguageCode || code === neutralLanguageCode,
    );
    if (usedLanguage) {
        return usedLanguage;
    }

    // Search in all languages
    return languages.find(
        ({ code }) =>
            toNeutralLanguageCode(code) === neutralLanguageCode || code === neutralLanguageCode,
    );
}

// See https://github.com/prezly/prezly/blob/master/lib/model/CulturePeer.php#L159
function getLanguageByShortRegionCode(languages: NewsroomLanguageSettings[], localeCode: string) {
    const shortRegionCode = toRegionCode(localeCode);

    // Prefer default language
    const defaultLanguage = getDefaultLanguage(languages);
    if (toRegionCode(defaultLanguage.code) === shortRegionCode) {
        return defaultLanguage;
    }

    // Try to look in used cultures first (giving priority to used ones)
    const usedLanguages = getUsedLanguages(languages);
    const usedLanguage = usedLanguages.find(({ code }) => toRegionCode(code) === shortRegionCode);
    if (usedLanguage) {
        return usedLanguage;
    }

    // Search in all languages
    return languages.find(({ code }) => toRegionCode(code) === shortRegionCode);
}

/**
 * Retrieve a culture with fallback to legacy codes support.
 * Pulled from https://github.com/prezly/prezly/blob/de9900d9890a33502780494aa3fb85c9a732b3c3/lib/model/CulturePeer.php#L91-L114
 */
export function getLanguageFromLocaleSlug(
    languages: NewsroomLanguageSettings[],
    nextLocaleSlug?: string,
): NewsroomLanguageSettings | undefined {
    const defaultLanguage = getDefaultLanguage(languages);

    if (!nextLocaleSlug || nextLocaleSlug === DUMMY_DEFAULT_LOCALE) {
        return defaultLanguage;
    }

    const localeCode = fromSlug(nextLocaleSlug);
    let targetLanguage: NewsroomLanguageSettings | undefined;

    if (nextLocaleSlug.length === 2) {
        targetLanguage =
            getLanguageByExactLocaleCode(languages, localeCode) ||
            getLanguageByNeutralLocaleCode(languages, localeCode) ||
            getLanguageByShortRegionCode(languages, localeCode);
        if (targetLanguage) {
            return targetLanguage;
        }
    } else {
        targetLanguage = getLanguageByExactLocaleCode(languages, localeCode);
    }

    return targetLanguage;
}

export function getCompanyInformation(languages: NewsroomLanguageSettings[], localeCode: string) {
    const currentLanguage =
        getLanguageByExactLocaleCode(languages, localeCode) || getDefaultLanguage(languages);

    return currentLanguage.company_information;
}
