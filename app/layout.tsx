import { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { ThemeSettingsProvider } from '@/adapters/client';
import { app, generateRootMetadata } from '@/adapters/server';
import { StoryImageFallbackProvider } from '@/components/StoryImage';
import { AnalyticsProvider } from '@/modules/Analytics';
import { BroadcastNotificationsProvider, BroadcastTranslationsProvider } from '@/modules/Broadcast';
import { Branding, Preconnect } from '@/modules/Head';
import { IntlProvider } from '@/modules/Intl';
import { RoutingProvider } from '@/modules/Routing';

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
    const settings = await app().themeSettings();

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
                                <ThemeSettingsProvider settings={settings}>
                                    <BroadcastNotificationsProvider>
                                        <BroadcastTranslationsProvider>
                                            {children}
                                        </BroadcastTranslationsProvider>
                                    </BroadcastNotificationsProvider>
                                </ThemeSettingsProvider>
                            </StoryImageFallbackProvider>
                        </AnalyticsProvider>
                    </IntlProvider>
                </RoutingProvider>
            </body>
        </html>
    );
}
