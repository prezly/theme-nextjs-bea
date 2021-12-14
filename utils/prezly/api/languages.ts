import type { NewsroomLanguageSettings, Story } from '@prezly/sdk';

import { DUMMY_DEFAULT_LOCALE } from '@/utils/locale';
import { LocaleObject } from '@/utils/localeObject';

export function getDefaultLanguage(languages: NewsroomLanguageSettings[]) {
    return languages.find(({ is_default }) => is_default) || languages[0];
}

export function getUsedLanguages(languages: NewsroomLanguageSettings[]) {
    return languages.filter((language) => language.stories_count > 0);
}

function getLanguageByExactLocaleCode(languages: NewsroomLanguageSettings[], locale: LocaleObject) {
    const localeCode = locale.toUnderscoreCode();
    return languages.find(({ code }) => code === localeCode);
}

// See https://github.com/prezly/prezly/blob/master/lib/model/CulturePeer.php#L123
function getLanguageByNeutralLocaleCode(
    languages: NewsroomLanguageSettings[],
    locale: LocaleObject,
) {
    const neutralLanguageCode = locale.toNeutralLanguageCode();

    // Prefer default language
    const defaultLanguage = getDefaultLanguage(languages);
    if (defaultLanguage.code === locale.toUnderscoreCode()) {
        return defaultLanguage;
    }

    // Try to look in used cultures first (giving priority to used ones)
    const usedLanguages = getUsedLanguages(languages);
    const usedLanguage = usedLanguages.find(
        ({ code }) =>
            LocaleObject.fromAnyCode(code).toNeutralLanguageCode() === neutralLanguageCode ||
            code === neutralLanguageCode,
    );
    if (usedLanguage) {
        return usedLanguage;
    }

    // Search in all languages
    return languages.find(
        ({ code }) =>
            LocaleObject.fromAnyCode(code).toNeutralLanguageCode() === neutralLanguageCode ||
            code === neutralLanguageCode,
    );
}

// See https://github.com/prezly/prezly/blob/master/lib/model/CulturePeer.php#L159
function getLanguageByShortRegionCode(languages: NewsroomLanguageSettings[], locale: LocaleObject) {
    const shortRegionCode = locale.toRegionCode();

    // Prefer default language
    const defaultLanguage = getDefaultLanguage(languages);
    if (LocaleObject.fromAnyCode(defaultLanguage.code).toRegionCode() === shortRegionCode) {
        return defaultLanguage;
    }

    // Try to look in used cultures first (giving priority to used ones)
    const usedLanguages = getUsedLanguages(languages);
    const usedLanguage = usedLanguages.find(
        ({ code }) => LocaleObject.fromAnyCode(code).toRegionCode() === shortRegionCode,
    );
    if (usedLanguage) {
        return usedLanguage;
    }

    // Search in all languages
    return languages.find(
        ({ code }) => LocaleObject.fromAnyCode(code).toRegionCode() === shortRegionCode,
    );
}

/**
 * Retrieve a culture with fallback to legacy codes support.
 * Pulled from https://github.com/prezly/prezly/blob/de9900d9890a33502780494aa3fb85c9a732b3c3/lib/model/CulturePeer.php#L91-L114
 */
export function getLanguageFromNextLocaleIsoCode(
    languages: NewsroomLanguageSettings[],
    nextLocaleIsoCode?: string,
): NewsroomLanguageSettings | undefined {
    const defaultLanguage = getDefaultLanguage(languages);

    if (!nextLocaleIsoCode || nextLocaleIsoCode === DUMMY_DEFAULT_LOCALE) {
        return defaultLanguage;
    }

    const locale = LocaleObject.fromAnyCode(nextLocaleIsoCode);
    let targetLanguage: NewsroomLanguageSettings | undefined;

    if (nextLocaleIsoCode.length === 2) {
        targetLanguage =
            getLanguageByExactLocaleCode(languages, locale) ||
            getLanguageByNeutralLocaleCode(languages, locale) ||
            getLanguageByShortRegionCode(languages, locale);
        if (targetLanguage) {
            return targetLanguage;
        }
    } else {
        targetLanguage = getLanguageByExactLocaleCode(languages, locale);
    }

    return targetLanguage;
}

export function getLanguageFromStory(languages: NewsroomLanguageSettings[], story: Story) {
    const { code: storyLocaleCode } = story.culture;

    return languages.find(({ code }) => code === storyLocaleCode);
}

export function getCompanyInformation(languages: NewsroomLanguageSettings[], locale: LocaleObject) {
    const currentLanguage =
        getLanguageByExactLocaleCode(languages, locale) || getDefaultLanguage(languages);

    return currentLanguage.company_information;
}

/**
 * Get shortest locale code possible from full locale code
 * First: try shorting to neutral language code (there should be no locales with the same language code)
 * Then: try shorting to region code (there should be no locales with the same region code)
 * Finally: return the original locale code (shorting is not possible)
 */
export function getShortestLocaleCode(
    languages: NewsroomLanguageSettings[],
    locale: LocaleObject,
): string | false {
    const localeCode = locale.toUnderscoreCode();
    const defaultLanguage = getDefaultLanguage(languages);
    // If it's a default locale, return false (no locale needed in URL)
    if (localeCode === defaultLanguage.code) {
        return false;
    }

    // Try shorting to neutral language code
    const neutralLanguageCode = locale.toNeutralLanguageCode();
    // The code is already as short as possible
    if (neutralLanguageCode === localeCode) {
        return localeCode;
    }

    const matchingLanguagesByNeutralCode = languages.filter(
        ({ code }) =>
            LocaleObject.fromAnyCode(code).toNeutralLanguageCode() === neutralLanguageCode ||
            code === neutralLanguageCode,
    );
    if (matchingLanguagesByNeutralCode.length === 1) {
        return neutralLanguageCode;
    }

    // Try shorting to region code
    const shortRegionCode = locale.toRegionCode();
    const matchingLanguagesByRegionCode = languages.filter(
        ({ code }) => LocaleObject.fromAnyCode(code).toRegionCode() === shortRegionCode,
    );
    // Prevent collision with neutral language codes
    const mathchingNeutralLanguagesByRegionCode = languages.filter(
        ({ code }) =>
            LocaleObject.fromAnyCode(code).toNeutralLanguageCode() === shortRegionCode ||
            code === shortRegionCode,
    );
    if (
        matchingLanguagesByRegionCode.length === 1 &&
        !mathchingNeutralLanguagesByRegionCode.length
    ) {
        return shortRegionCode;
    }

    return localeCode;
}
