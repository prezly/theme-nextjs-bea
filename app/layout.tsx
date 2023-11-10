import type { ReactNode } from 'react';

import { StoryImageFallbackProvider } from '@/components/StoryImage';
import { AnalyticsProvider } from '@/modules/Analytics';
import { Branding, Preconnect } from '@/modules/Head';
import { IntlProvider } from '@/modules/Intl';
import { RoutingProvider } from '@/modules/Routing';
import { api } from '@/theme/server';
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
    const { code: localeCode, isoCode, direction } = locale();

    const { contentDelivery } = api();

    const newsroom = await contentDelivery.newsroom();
    const languageSettings = await contentDelivery.languageOrDefault(localeCode);
    const brandName = languageSettings.company_information.name || newsroom.name;

    return (
        <html lang={isoCode} dir={direction}>
            <head>
                <meta name="og:locale" content={isoCode} />
                <Preconnect />
                <Branding />
            </head>
            <body>
                <RoutingProvider>
                    <IntlProvider>
                        <AnalyticsProvider>
                            <StoryImageFallbackProvider
                                image={newsroom.newsroom_logo}
                                text={brandName}
                            >
                                {children}
                            </StoryImageFallbackProvider>
                        </AnalyticsProvider>
                    </IntlProvider>
                </RoutingProvider>
            </body>
        </html>
    );
}
