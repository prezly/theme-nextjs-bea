import type { ReactNode } from 'react';

import { Intl } from '@/modules/Layout';
import { locale } from '@/theme-kit';

interface Props {
    children: ReactNode;
}

export default async function Document({ children }: Props) {
    const { isoCode, direction } = locale();

    return (
        <html lang={isoCode} dir={direction}>
            <head>
                <meta name="og:locale" content={isoCode} />
            </head>
            <body>
                <Intl>
                    {children}
                </Intl>
            </body>
        </html>
    );
}
