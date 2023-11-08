'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

import { formatDate, formatMessageFragment, formatTime } from '../shared';
import type { IntlMessageDescriptor, IntlMessageValues } from '../types';

import { useIntl } from './context';

export function FormattedMessage(props: {
    for: IntlMessageDescriptor;
    values?: IntlMessageValues<string | ReactElement>;
    locale?: Locale | Locale.Code;
}) {
    const { messages } = useIntl();

    return formatMessageFragment(messages, props.for, props.values);
}

export function FormattedDate(props: { date: Date }) {
    return <>{formatDate(props.date, 'DATE_FORMAT')}</>; // FIXME
}

export function FormattedTime(props: { date: Date }) {
    return <>{formatTime(props.date, 'TIME_FORMAT')}</>; // FIXME
}
