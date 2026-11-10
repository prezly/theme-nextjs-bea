import { IntlAdapter } from '@prezly/theme-kit-nextjs/server';
import type { ComponentProps } from 'react';

import { resolveDateFormat } from '@/utils';

import { app } from './app';

const {
    useIntl: getIntl,
    FormattedMessage,
    FormattedDate: BaseFormattedDate,
    FormattedTime,
} = IntlAdapter.connect({
    dateFormat: () => app().dateFormat(),
    timeFormat: () => app().timeFormat(),
    timezone: () => app().timezone(),
});

async function intl(localeCode: Parameters<typeof getIntl>[0]) {
    const result = await getIntl(localeCode);
    return { ...result, dateFormat: resolveDateFormat(localeCode, result.dateFormat) };
}

async function FormattedDate(props: ComponentProps<typeof BaseFormattedDate>) {
    const dateFormat = resolveDateFormat(props.locale ?? '', await app().dateFormat());
    return <BaseFormattedDate dateFormat={dateFormat} {...props} />;
}

export { intl, FormattedMessage, FormattedDate, FormattedTime };
