'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';

import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, DEFAULT_TIMEZONE } from '../constants';
import { formatMessageString } from '../shared';
import type {
    DateFormat,
    IntlDictionary,
    IntlMessageDescriptor,
    IntlMessageValues,
    TimeFormat,
    Timezone,
} from '../types';

interface IntlContext {
    locale: Locale.Code;
    defaultLocale: Locale.Code;
    locales: Locale.Code[];
    messages: IntlDictionary;
    timezone: Timezone;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
}

const context = createContext<IntlContext>({
    locale: 'en',
    locales: ['en'],
    defaultLocale: 'en',
    messages: {},
    timezone: DEFAULT_TIMEZONE,
    dateFormat: DEFAULT_DATE_FORMAT,
    timeFormat: DEFAULT_TIME_FORMAT,
});

export function IntlContextProvider({
    locale,
    locales,
    defaultLocale,
    messages,
    children,
    timezone,
    dateFormat,
    timeFormat,
}: IntlContext & {
    children: ReactNode;
}) {
    return (
        <context.Provider
            value={{ locale, locales, defaultLocale, messages, timezone, dateFormat, timeFormat }}
        >
            {children}
        </context.Provider>
    );
}

export function useIntl() {
    const { messages, locale, locales, defaultLocale, timezone, dateFormat, timeFormat } =
        useContext(context);

    const formatMessage = useCallback(
        (descriptor: IntlMessageDescriptor, values?: IntlMessageValues<string>) =>
            formatMessageString(messages, descriptor, values),
        [messages],
    );

    return {
        messages,
        locale,
        locales,
        defaultLocale,
        formatMessage,
        timezone,
        dateFormat,
        timeFormat,
    };
}
