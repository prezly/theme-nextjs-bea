/* eslint-disable @typescript-eslint/no-use-before-define */
import 'server-only';

import { getSupportedLocaleIsoCode } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

import { locale as currentLocale } from './locale';

type Descriptor = {
    id: string;
    defaultMessage?: string;
};

type Values<T> = Record<string, T>;

interface Props {
    values?: Values<string | ReactElement>;
    locale?: Locale | Locale.Code;
    for: Descriptor;
}

export async function FormattedMessage(props: Props) {
    const dictionary = await importDictionary(props.locale ?? currentLocale());

    return formatMessageFragment(dictionary, props.for, props.values);
}

export async function i18n(locale?: Locale | Locale.Code) {
    const dictionary = await importDictionary(locale ?? currentLocale());

    return {
        formatMessage(descriptor: Descriptor, values?: Values<string>) {
            return formatMessageString(dictionary, descriptor, values);
        },
    };
}

type Dictionary = Record<string, MessageFormat>;
type MessageFormat = { type: 0 | 1; value: string }[];

async function importDictionary(locale: Locale | Locale.Code): Promise<Dictionary> {
    const fileCode = getSupportedLocaleIsoCode(locale);

    return import(`@prezly/theme-kit-intl/messages/${fileCode}.json`);
}

function formatMessageString(
    dictionary: Dictionary,
    { id, defaultMessage }: Descriptor,
    values: Values<string> = {},
) {
    const format = dictionary[id];

    if (!format) {
        return defaultMessage ?? `[${id}]` ?? '';
    }

    return format
        .map(({ type, value }) => {
            if (type === 1) {
                return values[value] ?? `[${value}]`;
            }

            return value;
        })
        .join('');
}

function formatMessageFragment(
    dictionary: Dictionary,
    { id, defaultMessage }: Descriptor,
    values: Values<string | ReactElement> = {},
): ReactElement {
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
