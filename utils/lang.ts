import { convertToBrowserFormat } from './localeTransform';

export const DEFAULT_LOCALE = 'en';
export const DUMMY_DEFAULT_LOCALE = 'qps-ploc';

export function getLanguageDisplayName(locale: string) {
    const browserLocale = convertToBrowserFormat(locale);

    // TODO: Add polyfill (https://formatjs.io/docs/polyfills/intl-displaynames/#usage)
    // @ts-expect-error
    const regionNamesInNativeLanguage = new Intl.DisplayNames([browserLocale], {
        type: 'language',
    });
    return regionNamesInNativeLanguage.of(browserLocale);
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
