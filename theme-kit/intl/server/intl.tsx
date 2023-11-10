/* eslint-disable @typescript-eslint/no-use-before-define */

import { Locale } from '@prezly/theme-kit-intl';

import { api } from '@/theme/server';
import { locale as currentLocale } from '@/theme-kit';

import { formatMessageString } from '../shared';
import type { IntlMessageDescriptor, IntlMessageValues } from '../types';

import { importDictionary } from './importDictionary';

export async function intl(locale?: Locale | Locale.Code) {
    const localeCode = Locale.from(locale ?? currentLocale()).code;
    const newsroom = await api().contentDelivery.newsroom();
    const messages = await importDictionary(localeCode);

    return {
        locale: localeCode,
        messages,
        formatMessage(descriptor: IntlMessageDescriptor, values?: IntlMessageValues<string>) {
            return formatMessageString(messages, descriptor, values);
        },
        timezone: newsroom.timezone,
        dateFormat: newsroom.date_format,
        timeFormat: newsroom.time_format,
    };
}
