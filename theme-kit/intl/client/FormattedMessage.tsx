import type { Locale } from '@prezly/theme-kit-intl/build/cjs';
import type { ReactElement } from 'react';

import { formatMessageFragment } from '../shared';
import type { IntlMessageDescriptor, IntlMessageValues } from '../types';

import { useIntl } from './context';

interface Props {
    for: IntlMessageDescriptor;
    values?: IntlMessageValues<string | ReactElement>;
    locale?: Locale | Locale.Code;
}

export function FormattedMessage(props: Props) {
    const { messages } = useIntl();

    return formatMessageFragment(messages, props.for, props.values);
}
