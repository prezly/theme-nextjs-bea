import { getSupportedLocaleIsoCode } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';

export async function importMessages(locale: Locale.Code) {
    const localeIsoCode = getSupportedLocaleIsoCode(locale);
    return import(`@prezly/theme-kit-intl/messages/${localeIsoCode}.json`);
}
