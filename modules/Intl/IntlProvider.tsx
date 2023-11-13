import type { ReactNode } from 'react';

import { IntlContextProvider } from '@/theme/client';
import { api, intl } from '@/theme/server';
import { locale } from '@/theme-kit';

interface Props {
    children: ReactNode;
}

export async function IntlProvider({ children }: Props) {
    const { contentDelivery } = api();
    const { code } = locale();
    const languages = await contentDelivery.languages();
    const defaultLanguage = await contentDelivery.defaultLanguage();
    const { messages, timezone, dateFormat, timeFormat } = await intl();

    return (
        <IntlContextProvider
            locale={code}
            locales={languages.map((lang) => lang.code)}
            defaultLocale={defaultLanguage.code}
            messages={messages}
            timezone={timezone}
            dateFormat={dateFormat}
            timeFormat={timeFormat}
        >
            {children}
        </IntlContextProvider>
    );
}
