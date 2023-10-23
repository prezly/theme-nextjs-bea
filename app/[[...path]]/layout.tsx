import { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';

import router from '@/theme/_router';
import { api, bootHttpEnv } from '@/theme-kit';

interface Props {
    children: ReactNode;
    params: { path?: string[] };
}

export default async function Layout({ children, params: { path = [] } }: Props) {
    bootHttpEnv();

    const { contentDelivery } = api();
    const { match } = await router(path);

    const locale = match.locale ?? (await contentDelivery.defaultLanguage()).locale.code;

    return (
        <html lang={Locale.from(locale).isoCode}>
            <body>
                <h1>Root layout</h1>
                {children}
            </body>
        </html>
    );
}
