/* eslint-disable react/jsx-props-no-spreading */

'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

import {
    FormattedDate as BaseFormattedDate,
    FormattedTime as BaseFormattedTime,
    formatMessageFragment,
} from '../shared';
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

export function FormattedDate(props: BaseFormattedDate.Props) {
    const { dateFormat } = useIntl();

    return <BaseFormattedDate format={dateFormat} {...props} />;
}

export function FormattedTime(props: BaseFormattedTime.Props) {
    const { timeFormat } = useIntl();

    return <BaseFormattedTime format={timeFormat} {...props} />;
}
