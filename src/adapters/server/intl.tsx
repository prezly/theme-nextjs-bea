import type { Locale } from '@prezly/theme-kit-nextjs';
import { IntlAdapter } from '@prezly/theme-kit-nextjs/server';

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

type FormattedDateProps = Parameters<typeof BaseFormattedDate>[0] & { locale: Locale.Code };

/**
 * `locale` is required here: the server has no locale context to fall back on,
 * and CJK detection needs it. The resolved `dateFormat` is passed
 * explicitly (even when `undefined`) and after the spread: the connected
 * component only falls back to the newsroom format when the prop is absent.
 */
async function FormattedDate(props: FormattedDateProps) {
    const dateFormat = resolveDateFormat(
        props.locale,
        props.dateFormat ?? (await app().dateFormat()),
    );
    return <BaseFormattedDate {...props} dateFormat={dateFormat} />;
}

export { intl, FormattedMessage, FormattedDate, FormattedTime };
