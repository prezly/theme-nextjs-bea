import { Analytics } from '@prezly/analytics-nextjs';
import { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { ThemeSettingsProvider } from '@/adapters/client';
import { app, generateRootMetadata } from '@/adapters/server';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { StoryImageFallbackProvider } from '@/components/StoryImage';
import { AnalyticsProvider } from '@/modules/Analytics';
import {
    BroadcastNotificationsProvider,
    BroadcastPageTypesProvider,
    BroadcastTranslationsProvider,
} from '@/modules/Broadcast';
import { Branding, Preconnect } from '@/modules/Head';

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
    const { code, isoCode, direction } = Locale.from(app().locale()); // FIXME

    return (
        <html lang={isoCode} dir={direction}>
            <head>
                <meta name="og:locale" content={isoCode} />
                <Preconnect />
                <Branding />
            </head>
            <body>
                <AppContext localeCode={code}>
                    <Analytics />
                    {children}
                    <ScrollToTopButton />
                </AppContext>
            </body>
        </html>
    );
}

async function AppContext(props: { children: ReactNode; localeCode: Locale.Code }) {
    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(props.localeCode);
    const brandName = languageSettings.company_information.name || newsroom.name;
    const settings = await app().themeSettings();

    return (
        <AnalyticsProvider>
            <StoryImageFallbackProvider image={newsroom.newsroom_logo} text={brandName}>
                <ThemeSettingsProvider settings={settings}>
                    <BroadcastPageTypesProvider>
                        <BroadcastNotificationsProvider>
                            <BroadcastTranslationsProvider>
                                {props.children}
                            </BroadcastTranslationsProvider>
                        </BroadcastNotificationsProvider>
                    </BroadcastPageTypesProvider>
                </ThemeSettingsProvider>
            </StoryImageFallbackProvider>
        </AnalyticsProvider>
    );
}
