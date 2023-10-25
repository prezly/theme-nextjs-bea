/* eslint-disable @typescript-eslint/no-use-before-define */
import 'server-only';

import { getSupportedLocaleIsoCode } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

import { locale } from './locale';

type Descriptor = {
    id: string;
    defaultMessage?: string;
};

type Values = Record<string, string | ReactElement>;

type Props = {
    values?: Values;
    locale?: Locale.Code;
} & (
    | { id: Descriptor['id']; defaultMessage?: Descriptor['defaultMessage']; from?: never }
    | { id?: never; defaultMessage?: never; from: Descriptor }
);

export async function FormattedMessage(props: Props) {
    const { values } = props;
    const { id, defaultMessage } = props.from ?? props;
    const { formatMessage } = await i18n(props.locale);

    return formatMessage({ id, defaultMessage }, values);
}

export async function i18n(code?: Locale.Code) {
    const dictionary = await importDictionary(code ?? locale());

    return {
        formatMessage(descriptor: Descriptor, values: Values = {}) {
            return formatIntlMessage(dictionary, descriptor, values);
        },
    };
}

type Dictionary = Record<string, MessageFormat>;
type MessageFormat = { type: 0 | 1; value: string }[];

async function importDictionary(code: Locale.Code): Promise<Dictionary> {
    const fileCode = getSupportedLocaleIsoCode(code);

    return import(`@prezly/theme-kit-intl/messages/${fileCode}.json`);
}

function formatIntlMessage(
    dictionary: Dictionary,
    { id, defaultMessage }: Descriptor,
    values: Values = {},
) {
    const format = dictionary[id];

    if (!format) {
        return <>{defaultMessage ?? `[${id}]` ?? ''}</>;
    }

    return (
        <>
            {format.map(({ type, value }) => {
                if (type === 1) {
                    return values[value] ?? `[${value}]`;
                }

                return value;
            })}
        </>
    );
}
