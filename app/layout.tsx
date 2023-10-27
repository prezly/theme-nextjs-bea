import type { ReactNode } from 'react';

import { Branding, Preconnect } from '@/modules/Head';
import { Intl } from '@/modules/Layout';
import { analytics, api, locale } from '@/theme-kit';
import { generateRootMetadata } from '@/theme-kit/metadata';

import { AnalyticsProvider } from './AnalyticsProvider';

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
    const { isTrackingEnabled } = analytics();
    const { contentDelivery } = api();
    const newsroom = await contentDelivery.newsroom();

    return (
        <html lang={isoCode} dir={direction}>
            <head>
                <meta name="og:locale" content={isoCode} />
                <Preconnect />
                <Branding />
            </head>
            <body>
                <Intl>
                    <AnalyticsProvider newsroom={newsroom} isEnabled={isTrackingEnabled}>
                        {children}
                    </AnalyticsProvider>
                </Intl>
            </body>
        </html>
    );
}
