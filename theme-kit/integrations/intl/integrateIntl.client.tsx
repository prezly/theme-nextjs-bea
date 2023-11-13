'use client';

/* eslint-disable react/jsx-props-no-spreading */
import { getShortestLocaleSlug } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactElement, ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';

import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, DEFAULT_TIMEZONE } from './lib/constants';
import {
    FormattedDate as BaseFormattedDate,
    FormattedTime as BaseFormattedTime,
    formatMessageFragment,
    formatMessageString,
} from './lib/shared';
import type {
    DateFormat,
    IntlDictionary,
    IntlMessageDescriptor,
    IntlMessageValues,
    TimeFormat,
    Timezone,
} from './lib/types';

interface IntlContext {
    locale: Locale.Code;
    defaultLocale: Locale.Code;
    locales: Locale.Code[];
    messages: IntlDictionary;
    timezone: Timezone;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
}

export function integrateIntl() {
    const context = createContext<IntlContext>({
        locale: 'en',
        locales: ['en'],
        defaultLocale: 'en',
        messages: {},
        timezone: DEFAULT_TIMEZONE,
        dateFormat: DEFAULT_DATE_FORMAT,
        timeFormat: DEFAULT_TIME_FORMAT,
    });

    function IntlContextProvider({ children, ...value }: IntlContext & { children: ReactNode }) {
        return <context.Provider value={value}>{children}</context.Provider>;
    }

    function useIntl() {
        const { messages, ...value } = useContext(context);

        const formatMessage = useCallback(
            (descriptor: IntlMessageDescriptor, values?: IntlMessageValues<string>) =>
                formatMessageString(messages, descriptor, values),
            [messages],
        );

        return { ...value, messages, formatMessage };
    }

    function useLocaleSlug(localeCode?: Locale.AnyCode): Locale.AnySlug | false {
        const { locale, locales, defaultLocale } = useIntl();

        const languages = locales.map((code) => ({ code, is_default: code === defaultLocale }));

        return getShortestLocaleSlug(languages, localeCode ?? locale);
    }

    function FormattedMessage(props: {
        for: IntlMessageDescriptor;
        values?: IntlMessageValues<string | ReactElement>;
        locale?: Locale | Locale.Code;
    }) {
        const { messages } = useIntl();

        return formatMessageFragment(messages, props.for, props.values);
    }

    function FormattedDate(props: BaseFormattedDate.Props) {
        const { dateFormat } = useIntl();

        return <BaseFormattedDate format={dateFormat} {...props} />;
    }

    function FormattedTime(props: BaseFormattedTime.Props) {
        const { timeFormat } = useIntl();

        return <BaseFormattedTime format={timeFormat} {...props} />;
    }

    return {
        useIntl,
        useLocaleSlug,
        IntlContextProvider,
        FormattedMessage,
        FormattedTime,
        FormattedDate,
    };
}
