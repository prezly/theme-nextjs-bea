import type { ReactNode } from 'react';

import { IntlContextProvider } from '@/adapters/client';
import { app, intl } from '@/adapters/server';

interface Props {
    children: ReactNode;
}

export async function IntlProvider({ children }: Props) {
    const { locale, defaultLocale, locales } = app();
    const { messages, timezone } = await intl();

    return (
        <IntlContextProvider
            locale={locale()}
            locales={await locales()}
            defaultLocale={await defaultLocale()}
            messages={messages}
            timezone={timezone}
        >
            {children}
        </IntlContextProvider>
    );
}
