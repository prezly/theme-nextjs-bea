import { getSupportedLocaleIsoCode, LocaleObject } from '@prezly/theme-kit-core';

export async function importMessages(localeCode: string) {
    const locale = LocaleObject.fromAnyCode(localeCode);
    const localeIsoCode = getSupportedLocaleIsoCode(locale);
    const messages = await import(`@prezly/themes-intl-messages/messages/${localeIsoCode}.json`);
    return messages.default;
}
