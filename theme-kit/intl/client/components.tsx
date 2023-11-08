'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

import { formatDate, formatMessageFragment, formatTime } from '../shared';
import type { IntlMessageDescriptor, IntlMessageValues, Iso8601Date } from '../types';

import { useIntl } from './context';

export function FormattedMessage(props: {
    for: IntlMessageDescriptor;
    values?: IntlMessageValues<string | ReactElement>;
    locale?: Locale | Locale.Code;
}) {
    const { messages } = useIntl();

    return formatMessageFragment(messages, props.for, props.values);
}

export function FormattedDate(props: { value: Date | Iso8601Date }) {
    // TODO: Add timeZone
    return <>{formatDate(props.value, 'DATE_FORMAT')}</>; // FIXME
}

export function FormattedTime(props: { value: Date | Iso8601Date }) {
    // TODO: Add timeZone
    return <>{formatTime(props.value, 'TIME_FORMAT')}</>; // FIXME
}
