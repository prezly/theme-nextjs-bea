import { DEFAULT_LOCALE, DUMMY_DEFAULT_LOCALE, getSupportedLocaleSlug, toSlug } from './locale';

export function getLanguageDisplayName(localeCode: string) {
    const localeSlug = toSlug(localeCode);

    // TODO: Add polyfill (https://formatjs.io/docs/polyfills/intl-displaynames/#usage)
    // @ts-expect-error
    const regionNamesInNativeLanguage = new Intl.DisplayNames([localeSlug], {
        type: 'language',
    });
    return regionNamesInNativeLanguage.of(localeSlug);
}

export async function importMessages(localeCode: string) {
    const localeSlug = getSupportedLocaleSlug(localeCode);
    return import(`@prezly/themes-intl-messages/messages/${localeSlug}.json`);
}

export { DEFAULT_LOCALE, DUMMY_DEFAULT_LOCALE };
