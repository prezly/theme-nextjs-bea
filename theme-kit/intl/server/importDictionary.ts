import { getSupportedLocaleIsoCode } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';

import type { IntlDictionary } from '../types';

export async function importDictionary(locale: Locale | Locale.Code): Promise<IntlDictionary> {
    const fileCode = getSupportedLocaleIsoCode(locale);

    const messages = await import(`@prezly/theme-kit-intl/messages/${fileCode}.json`);

    return { ...messages };
}
