import { DEFAULT_LOCALE, DUMMY_DEFAULT_LOCALE, getSupportedLocaleIsoCode } from './locale';
import { LocaleObject } from './localeObject';

function toSentenceCase(string: string): string {
    return string.charAt(0).toLocaleUpperCase() + string.slice(1);
}

export function getLanguageDisplayName(locale: LocaleObject) {
    const localeIsoCode = locale.toHyphenCode();

    // TODO: Add polyfill (https://formatjs.io/docs/polyfills/intl-displaynames/#usage)
    // @ts-expect-error
    const regionNamesInNativeLanguage = new Intl.DisplayNames([localeIsoCode], {
        type: 'language',
    });
    return toSentenceCase(regionNamesInNativeLanguage.of(localeIsoCode));
}

export async function importMessages(locale: LocaleObject) {
    const localeIsoCode = getSupportedLocaleIsoCode(locale);
    return import(`@prezly/themes-intl-messages/messages/${localeIsoCode}.json`);
}

export { DEFAULT_LOCALE, DUMMY_DEFAULT_LOCALE };
