import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

import { locale as currentLocale } from '@/theme-kit';

import { formatDate, formatMessageFragment, formatTime } from '../shared';
import type { IntlMessageDescriptor, IntlMessageValues } from '../types';

import { importDictionary } from './importDictionary';

export async function FormattedMessage(props: {
    for: IntlMessageDescriptor;
    values?: IntlMessageValues<string | ReactElement>;
    locale?: Locale | Locale.Code;
}) {
    const dictionary = await importDictionary(props.locale ?? currentLocale());

    return formatMessageFragment(dictionary, props.for, props.values);
}

export async function FormattedDate(props: { date: Date }) {
    // TODO: Add timeZone
    return <>{formatDate(props.date, 'DATE_FORMAT')}</>;
}

export async function FormattedTime(props: { date: Date }) {
    // TODO: Add timeZone
    return <>{formatTime(props.date, 'TIME_FORMAT')}</>;
}
