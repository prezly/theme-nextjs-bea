import { CultureRef, NewsroomLanguageSettings } from '@prezly/sdk';

import { getSupportedLocaleIsoCode } from './locale';
import { LocaleObject } from './localeObject';

function isOnlyCulture(culture: CultureRef, languages: NewsroomLanguageSettings[]): boolean {
    const numberOfLanguages = languages.filter(
        ({ locale: { language_code } }) => language_code === culture.language_code,
    ).length;

    return numberOfLanguages === 1;
}

/**
 * If there's only one culture used in a specific language,
 * we strip the culture name completely.
 *
 * Examples:
 *  - English (Global), Spanish (Spain)
 *      -> English, Spanish
 *  - English (Global), English (UK), Spanish (Spain)
 *      -> English (Global), English (UK), Spanish
 */
export function getLanguageDisplayName(
    language: NewsroomLanguageSettings,
    languages: NewsroomLanguageSettings[],
): string {
    const { locale } = language;

    if (isOnlyCulture(locale, languages)) {
        const cultureNameIndex = locale.native_name.indexOf('(');

        if (cultureNameIndex !== -1) {
            return locale.native_name.slice(0, cultureNameIndex - 1);
        }
    }

    return locale.native_name;
}

export async function importMessages(localeCode: string) {
    const locale = LocaleObject.fromAnyCode(localeCode);
    const localeIsoCode = getSupportedLocaleIsoCode(locale);
    const messages = await import(`@prezly/themes-intl-messages/messages/${localeIsoCode}.json`);
    return messages.default;
}
