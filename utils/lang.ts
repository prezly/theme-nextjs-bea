import { getRegionalLocaleFromShortLocale, getShortLocale } from '@/utils/localeTransform';

import supportedLocales from '../locale.config';

export const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES: Array<string> = supportedLocales;

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
    // TODO: Add polyfill (https://formatjs.io/docs/polyfills/intl-displaynames/#usage)
    const regionNamesInNativeLanguage = new Intl.DisplayNames([locale], { type: 'language' });
    return regionNamesInNativeLanguage.of(locale);
}

export async function importMessages(locale?: string) {
    try {
        let localeCode = locale;

        if (!localeCode) {
            localeCode = DEFAULT_LOCALE;
        }

        return await import(`@/lang/compiled/${localeCode}.json`);
    } catch {
        // If locale is not supported, return default locale messages
        // eslint-disable-next-line no-console
        console.error(`Error: No messages file found for locale: ${locale}`);

        return await import(`@/lang/compiled/${DEFAULT_LOCALE}.json`);
    }
}
