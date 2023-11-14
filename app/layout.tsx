import { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';

import { StoryImageFallbackProvider } from '@/components/StoryImage';
import { AnalyticsProvider } from '@/modules/Analytics';
import { Branding, Preconnect } from '@/modules/Head';
import { IntlProvider } from '@/modules/Intl';
import { RoutingProvider } from '@/modules/Routing';
import { app, generateRootMetadata } from '@/theme/server';

import '@prezly/content-renderer-react-js/styles.css';
import '@prezly/uploadcare-image/build/styles.css';
import 'modern-normalize/modern-normalize.css';
import '@/styles/styles.globals.scss';

interface Props {
    children: ReactNode;
}

export async function generateMetadata() {
    return generateRootMetadata({ indexable: !process.env.VERCEL });
}

export default async function Document({ children }: Props) {
    const { code: localeCode, isoCode, direction } = Locale.from(app().locale());

    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(localeCode);
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
