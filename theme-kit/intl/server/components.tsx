/* eslint-disable react/jsx-props-no-spreading */
import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

import { locale as currentLocale } from '@/theme-kit';
import { intl } from '@/theme-kit/intl/server/intl';

import {
    FormattedDate as BaseFormattedDate,
    FormattedTime as BaseFormattedTime,
    formatMessageFragment,
} from '../shared';
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

export async function FormattedDate(props: BaseFormattedDate.Props) {
    const { dateFormat } = await intl();

    return <BaseFormattedDate format={dateFormat} {...props} />;
}

export async function FormattedTime(props: BaseFormattedTime.Props) {
    const { timeFormat } = await intl();

    return <BaseFormattedTime format={timeFormat} {...props} />;
}
