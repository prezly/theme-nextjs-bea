import 'server-only';

import { getSupportedLocaleIsoCode } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';

import { locale } from './locale';

type Descriptor = {
    id: string;
    defaultMessage?: string;
};

type Never<T> = { [key in keyof T]?: never };

type DescriptorProps = (Descriptor & { from?: never }) | (Never<Descriptor> & { from: Descriptor });

type Props = {
    values?: Record<string, string>;
    locale?: Locale.Code;
} & DescriptorProps;

type Dictionary = Record<string, MessageFormat>;
type MessageFormat = { type: 0 | 1; value: string }[];

export async function i18n(code: Locale.Code): Promise<Dictionary> {
    const fileCode = getSupportedLocaleIsoCode(code);

    return import(`@prezly/theme-kit-intl/messages/${fileCode}.json`);
}

export async function FormattedMessage(props: Props) {
    const { values = {} } = props;
    const { id, defaultMessage } = props.from ?? props;

    const localeCode = props.locale ?? locale();
    const dictionary = await i18n(localeCode);
    const format = dictionary[id];

    if (!format) {
        return <>{defaultMessage ?? `[${id}]` ?? ''}</>;
    }

    const formatted = format
        .map(({ type, value }) => {
            if (type === 1) {
                return values[value] ?? `[${value}]`;
            }

            return value;
        })
        .join('');

    return <>{formatted}</>;
}
