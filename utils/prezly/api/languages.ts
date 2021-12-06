import { NewsroomLanguageSettings, Story } from '@prezly/sdk';

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

export function getLanguageFromStory(languages: NewsroomLanguageSettings[], story: Story) {
    const { code: storyLocaleCode } = story.culture;

    return languages.find(({ code }) => code === storyLocaleCode);
}

export function getCompanyInformation(languages: NewsroomLanguageSettings[], localeCode: string) {
    const currentLanguage =
        getLanguageByExactLocaleCode(languages, localeCode) || getDefaultLanguage(languages);

    return currentLanguage.company_information;
}

/**
 * Get shortest locale code possible from full locale code
 * First: try shorting to neutral language code (there should be no locales with the same language code)
 * Then: try shorting to region code (there should be no locales with the same region code)
 * Finally: return the original locale code (shorting is not possible)
 */
export function getShortestLocaleCode(languages: NewsroomLanguageSettings[], localeCode: string) {
    const defaultLanguage = getDefaultLanguage(languages);
    // If it's a default locale, return false (no locale needed in URL)
    if (localeCode === defaultLanguage.code) {
        return false;
    }

    // Try shorting to neutral language code
    const neutralLanguageCode = toNeutralLanguageCode(localeCode);
    // The code is already as short as possible
    if (neutralLanguageCode === localeCode) {
        return localeCode;
    }

    const matchingLanguagesByNeutralCode = languages.filter(
        ({ code }) =>
            toNeutralLanguageCode(code) === neutralLanguageCode || code === neutralLanguageCode,
    );
    if (matchingLanguagesByNeutralCode.length === 1) {
        return neutralLanguageCode;
    }

    // Try shorting to region code
    const shortRegionCode = toRegionCode(localeCode);
    const matchingLanguagesByRegionCode = languages.filter(
        ({ code }) => toRegionCode(code) === shortRegionCode,
    );
    // Prevent collision with neutral language codes
    const mathchingNeutralLanguagesByRegionCode = languages.filter(
        ({ code }) => toNeutralLanguageCode(code) === shortRegionCode || code === shortRegionCode,
    );
    if (
        matchingLanguagesByRegionCode.length === 1 &&
        !mathchingNeutralLanguagesByRegionCode.length
    ) {
        return shortRegionCode;
    }

    return localeCode;
}
