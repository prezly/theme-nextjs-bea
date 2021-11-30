import {
    convertToBrowserFormat,
    DEFAULT_LOCALE,
    DUMMY_DEFAULT_LOCALE,
    getSupportedLocale,
} from './locale';

export function getLanguageDisplayName(locale: string) {
    const browserLocale = convertToBrowserFormat(locale);

    // TODO: Add polyfill (https://formatjs.io/docs/polyfills/intl-displaynames/#usage)
    // @ts-expect-error
    const regionNamesInNativeLanguage = new Intl.DisplayNames([browserLocale], {
        type: 'language',
    });
    return regionNamesInNativeLanguage.of(browserLocale);
}

export async function importMessages(locale: string) {
    const localeCode = getSupportedLocale(locale);
    return import(`@prezly/themes-intl-messages/messages/${localeCode}.json`);
}

export { DEFAULT_LOCALE, DUMMY_DEFAULT_LOCALE };
