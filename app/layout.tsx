import type { ReactNode } from 'react';

import { Branding, Preconnect } from '@/modules/Head';
import { Analytics, Intl } from '@/modules/Layout';
import { locale } from '@/theme-kit';
import { generateRootMetadata } from '@/theme-kit/metadata';

import '@prezly/content-renderer-react-js/styles.css';
import '@prezly/uploadcare-image/build/styles.css';
import 'modern-normalize/modern-normalize.css';
import '@/styles/styles.globals.scss';

interface Props {
    children: ReactNode;
}

export async function generateMetadata() {
    return generateRootMetadata({
        localeCode: locale().code,
        indexable: !process.env.VERCEL,
    });
}

export default async function Document({ children }: Props) {
    const { isoCode, direction } = locale();

    return (
        <html lang={isoCode} dir={direction}>
            <head>
                <meta name="og:locale" content={isoCode} />
                <Preconnect />
                <Branding />
            </head>
            <body>
                <Intl>
                    <Analytics>{children}</Analytics>
                </Intl>
            </body>
        </html>
    );
}
