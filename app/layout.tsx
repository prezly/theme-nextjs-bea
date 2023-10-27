import type { ReactNode } from 'react';

import { api, locale } from '@/theme-kit';
import { IntlProvider } from '@/theme-kit/intl/client';
import { intl } from '@/theme-kit/intl/server';

interface Props {
    children: ReactNode;
}

export default async function Document({ children }: Props) {
    const { contentDelivery } = api();
    const { code, isoCode, direction } = locale();
    const languages = await contentDelivery.languages();
    const defaultLanguage = await contentDelivery.defaultLanguage();
    const { messages } = await intl();

    return (
        <html lang={isoCode} dir={direction}>
            <head>
                <meta name="og:locale" content={isoCode} />
            </head>
            <body>
                <IntlProvider
                    locale={code}
                    locales={languages.map((lang) => lang.code)}
                    defaultLocale={defaultLanguage.code}
                    messages={messages}
                >
                    {children}
                </IntlProvider>
            </body>
        </html>
    );
}
