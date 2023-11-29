import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { IntlProvider as BaseIntlProvider } from '@/adapters/client';
import { app, intl } from '@/adapters/server';

interface Props {
    localeCode: Locale.Code;
    children: ReactNode;
}

export async function IntlProvider({ localeCode, children }: Props) {
    const { defaultLocale, locales } = app();
    const { messages, timezone } = await intl(localeCode);

    return (
        <BaseIntlProvider
            locale={localeCode}
            locales={await locales()}
            defaultLocale={await defaultLocale()}
            messages={messages}
            timezone={timezone}
        >
            {children}
        </BaseIntlProvider>
    );
}
