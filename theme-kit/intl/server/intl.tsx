/* eslint-disable @typescript-eslint/no-use-before-define */

import { Locale } from '@prezly/theme-kit-intl';

import { locale as currentLocale } from '@/theme-kit';

import { formatMessageString } from '../shared';
import type { IntlMessageDescriptor, IntlMessageValues } from '../types';

import { importDictionary } from './importDictionary';

export async function intl(locale?: Locale | Locale.Code) {
    const localeCode = Locale.from(locale ?? currentLocale()).code;
    const messages = await importDictionary(localeCode);

    return {
        locale: localeCode,
        messages,
        formatMessage(descriptor: IntlMessageDescriptor, values?: IntlMessageValues<string>) {
            return formatMessageString(messages, descriptor, values);
        },
    };
}
