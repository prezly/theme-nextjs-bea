'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface IntlContext {
    locale: Locale.Code;
    defaultLocale: Locale.Code;
    locales: Locale.Code[];
}

const context = createContext<IntlContext>({
    locale: 'en',
    locales: ['en'],
    defaultLocale: 'en',
});

export function IntlProvider({
    locale,
    locales,
    defaultLocale,
    children,
}: IntlContext & {
    children: ReactNode;
}) {
    return (
        <context.Provider value={{ locale, locales, defaultLocale }}>{children}</context.Provider>
    );
}

export function useIntl() {
    return useContext(context);
}
