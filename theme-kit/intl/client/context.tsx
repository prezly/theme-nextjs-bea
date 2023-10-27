'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';

import { formatMessageString } from '@/theme-kit/intl/shared';

import type { IntlDictionary, IntlMessageDescriptor, IntlMessageValues } from '../types';

interface IntlContext {
    locale: Locale.Code;
    defaultLocale: Locale.Code;
    locales: Locale.Code[];
    messages: IntlDictionary;
}

const context = createContext<IntlContext>({
    locale: 'en',
    locales: ['en'],
    defaultLocale: 'en',
    messages: {},
});

export function IntlProvider({
    locale,
    locales,
    defaultLocale,
    messages,
    children,
}: IntlContext & {
    children: ReactNode;
}) {
    return (
        <context.Provider value={{ locale, locales, defaultLocale, messages }}>
            {children}
        </context.Provider>
    );
}

export function useIntl() {
    const { messages, locale, locales, defaultLocale } = useContext(context);

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
    };
}
