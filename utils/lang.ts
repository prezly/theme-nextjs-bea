import { getRegionalLocaleFromShortLocale, getShortLocale } from '@/utils/localeTransform';

import supportedLocales from '../locale.config';

export const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES: Array<string> = supportedLocales;

// You can disable a language by providing an empty display name for it.
/* eslint-disable @typescript-eslint/naming-convention, id-blacklist */
const LANGUAGE_NAME_BY_LOCALE_CODE: Record<string, string> = {
    af: 'Afrikaans',
    ar: 'العربية',
    az: 'Azərbaycanca',
    be: 'Беларуская',
    bg: 'Български',
    cs: 'Čeština',
    da: 'Dansk',
    de: 'Deutsch',
    el: 'ελληνικά',
    en: 'English',
    es: 'Español',
    et: 'Eesti',
    fi: 'Suomi',
    fil: 'Pilipino',
    fr: 'Français',
    ga: 'Gaeilge',
    he: 'עִבְרִית',
    hi: 'हिन्दी',
    hr: 'Hrvatski',
    hu: 'Magyar',
    id: 'Bahasa Indonesia',
    it: 'Italiano',
    ja: '日本語',
    kk: 'Қазақ тілі',
    ko: '한국인',
    // There are no translations for Kyrgyz yet
    ky: '',
    lt: 'Lietuvių',
    lv: 'Latvijas',
    mt: 'Malti',
    nl: 'Nederlands',
    no: 'Norsk',
    pl: 'Polski',
    pt: 'Português',
    'pt-BR': 'Português (Brasil)',
    ro: 'Română',
    ru: 'Русский',
    sk: 'Slovenský',
    sl: 'Slovenščina',
    sv: 'Svenska',
    th: 'ภาษาไทย',
    tr: 'Türk',
    uk: 'Українська',
    ur: 'اردو',
    uz: "O'zbek",
    vi: 'Tiếng Việt',
    'zh-CN': '中文',
    'zh-TW': '中國',
};
/* eslint-enable @typescript-eslint/naming-convention, id-blacklist */

export function getSupportedLocaleCode(locale?: string) {
    if (!locale) {
        return '';
    }

    if (LANGUAGE_NAME_BY_LOCALE_CODE[locale]) {
        return locale;
    }

    const shortLocale = getShortLocale(locale);
    if (LANGUAGE_NAME_BY_LOCALE_CODE[shortLocale]) {
        return shortLocale;
    }

    return '';
}

export function getPrezlyLocaleCode(locale?: string) {
    if (!locale) {
        return DEFAULT_LOCALE;
    }

    if (SUPPORTED_LOCALES.includes(locale)) {
        return locale;
    }

    const shortLocale = getShortLocale(locale);
    if (SUPPORTED_LOCALES.includes(shortLocale)) {
        return shortLocale;
    }

    const regionLocale = getRegionalLocaleFromShortLocale(shortLocale);
    if (SUPPORTED_LOCALES.includes(regionLocale)) {
        return regionLocale;
    }

    return DEFAULT_LOCALE;
}

export function getLanguageDisplayName(locale: string) {
    return LANGUAGE_NAME_BY_LOCALE_CODE[getSupportedLocaleCode(locale)];
}

export async function importMessages(locale?: string) {
    try {
        let localeCode = getSupportedLocaleCode(locale);

        if (!localeCode) {
            // If locale is not supported, return default locale messages
            // eslint-disable-next-line no-console
            console.error(`Error: No messages file found for locale: ${locale}`);

            localeCode = DEFAULT_LOCALE;
        }

        return await import(`@/lang/compiled/${localeCode}.json`);
    } catch {
        // eslint-disable-next-line no-console
        console.error(`Error: Could not load messages for locale: ${locale}`);
        return {};
    }
}
