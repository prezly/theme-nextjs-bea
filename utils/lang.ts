import { getSupportedLocaleIsoCode, LocaleObject } from '@prezly/theme-kit-nextjs';

export async function importMessages(localeCode: string) {
    const locale = LocaleObject.fromAnyCode(localeCode);
    const localeIsoCode = getSupportedLocaleIsoCode(locale);
    const messages = await import(`@prezly/themes-intl-messages/messages/${localeIsoCode}.json`);
    return messages.default;
}
