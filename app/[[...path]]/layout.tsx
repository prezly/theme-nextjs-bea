import { LocaleObject } from '@prezly/theme-kit-core';
import type { ReactNode } from 'react';

import router from '@/theme/_router';
import { api } from '@/theme-kit';

interface Props {
    children: ReactNode;
    params: { path?: string[] };
}

export default async function Layout({ children, params: { path = [] } }: Props) {
    const { contentDelivery } = api();
    const { match } = await router(path);

    const locale = match.locale ?? (await contentDelivery.defaultLanguage()).locale.code;

    return (
        <html lang={LocaleObject.fromAnyCode(locale).toHyphenCode()}>
            <body>
                <h1>Root layout</h1>
                {children}
            </body>
        </html>
    );
}
