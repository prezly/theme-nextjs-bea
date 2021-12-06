import { DEFAULT_LOCALE, DUMMY_DEFAULT_LOCALE, getSupportedLocaleSlug, toIsoCode } from './locale';

function toSentenceCase(string: string): string {
    return string.charAt(0).toLocaleUpperCase() + string.slice(1);
}

export function getLanguageDisplayName(localeCode: string) {
    const localeIsoCode = toIsoCode(localeCode);

    // TODO: Add polyfill (https://formatjs.io/docs/polyfills/intl-displaynames/#usage)
    // @ts-expect-error
    const regionNamesInNativeLanguage = new Intl.DisplayNames([localeIsoCode], {
        type: 'language',
    });
    return toSentenceCase(regionNamesInNativeLanguage.of(localeIsoCode));
}

export async function importMessages(localeCode: string) {
    const localeSlug = getSupportedLocaleSlug(localeCode);
    return import(`@prezly/themes-intl-messages/messages/${localeSlug}.json`);
}

export { DEFAULT_LOCALE, DUMMY_DEFAULT_LOCALE };
