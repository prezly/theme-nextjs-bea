import 'server-only';

import { getSupportedLocaleIsoCode } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

import { locale } from './locale';

type Descriptor = {
    id: string;
    defaultMessage?: string;
};

type Never<T> = { [key in keyof T]?: never };

type DescriptorProps = (Descriptor & { from?: never }) | (Never<Descriptor> & { from: Descriptor });

type Props = {
    values?: Record<string, string | ReactElement>;
    locale?: Locale.Code;
} & DescriptorProps;

type Dictionary = Record<string, MessageFormat>;
type MessageFormat = { type: 0 | 1; value: string }[];

export async function i18n(code: Locale.Code): Promise<Dictionary> {
    const fileCode = getSupportedLocaleIsoCode(code);

    return import(`@prezly/theme-kit-intl/messages/${fileCode}.json`);
}

export async function formatMessage(
    { id, defaultMessage, locale: overrideLocale }: Descriptor & { locale?: Locale.Code },
    values: Props['values'] = {},
) {
    const localeCode = overrideLocale ?? locale();
    const dictionary = await i18n(localeCode);
    const format = dictionary[id];

    if (!format) {
        return defaultMessage ?? `[${id}]` ?? '';
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

export async function FormattedMessage(props: Props) {
    const { values } = props;
    const { id, defaultMessage } = props.from ?? props;

    const formatted = await formatMessage({ id, defaultMessage, locale: props.locale }, values);

    return <>{formatted}</>;
}
