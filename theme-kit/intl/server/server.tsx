/* eslint-disable @typescript-eslint/no-use-before-define */

import { getSupportedLocaleIsoCode } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl/build/cjs';
import type { ReactElement } from 'react';

import { locale as currentLocale } from '@/theme-kit';

import { formatMessageFragment, formatMessageString } from '../shared';
import type { IntlDictionary, IntlMessageDescriptor, IntlMessageValues } from '../types';

interface Props {
    for: IntlMessageDescriptor;
    values?: IntlMessageValues<string | ReactElement>;
    locale?: Locale | Locale.Code;
}

export async function FormattedMessage(props: Props) {
    const dictionary = await importDictionary(props.locale ?? currentLocale());

    return formatMessageFragment(dictionary, props.for, props.values);
}

export async function intl(locale?: Locale | Locale.Code) {
    const messages = await importDictionary(locale ?? currentLocale());

    return {
        messages,
        formatMessage(descriptor: IntlMessageDescriptor, values?: IntlMessageValues<string>) {
            return formatMessageString(messages, descriptor, values);
        },
    };
}

async function importDictionary(locale: Locale | Locale.Code): Promise<IntlDictionary> {
    const fileCode = getSupportedLocaleIsoCode(locale);

    const messages = await import(`@prezly/theme-kit-intl/messages/${fileCode}.json`);

    return { ...messages };
}
