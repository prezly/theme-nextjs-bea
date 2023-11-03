import type { ReactNode } from 'react';

import { Branding, Preconnect } from '@/modules/Head';
import { Analytics } from '@/modules/Layout/Analytics';
import { Intl } from '@/modules/Layout/Intl';
import { Routing } from '@/modules/Layout/Routing';
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
                <Routing>
                    <Intl>
                        <Analytics>{children}</Analytics>
                    </Intl>
                </Routing>
            </body>
        </html>
    );
}
