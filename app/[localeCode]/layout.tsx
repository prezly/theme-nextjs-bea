import { Analytics } from '@prezly/analytics-nextjs';
import { Locale, Newsrooms } from '@prezly/theme-kit-nextjs';
import type { Viewport } from 'next';
import type { ReactNode } from 'react';

import { ThemeSettingsProvider } from '@/adapters/client';
import { analytics, app, generateRootMetadata, themeSettings } from '@/adapters/server';
import { CategoryImageFallbackProvider } from '@/components/CategoryImage';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { StoryImageFallbackProvider } from '@/components/StoryImage';
import { AnalyticsProvider } from '@/modules/Analytics';
import { Boilerplate } from '@/modules/Boilerplate';
import {
    BroadcastGalleryProvider,
    BroadcastNotificationsProvider,
    BroadcastPageTypesProvider,
    BroadcastStoryProvider,
    BroadcastTranslationsProvider,
} from '@/modules/Broadcast';
import { CookieConsent } from '@/modules/CookieConsent';
import { Footer } from '@/modules/Footer';
import { Branding, Preconnect } from '@/modules/Head';
import { Header } from '@/modules/Header';
import { IntlProvider } from '@/modules/Intl';
import { Notifications } from '@/modules/Notifications';
import { RoutingProvider } from '@/modules/Routing';
import { SubscribeForm } from '@/modules/SubscribeForm';

import '@prezly/content-renderer-react-js/styles.css';
import '@prezly/uploadcare-image/build/styles.css';
import 'modern-normalize/modern-normalize.css';
import '@/styles/styles.globals.scss';

import styles from './layout.module.scss';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
    children: ReactNode;
}

export async function generateViewport(): Promise<Viewport> {
    const settings = await themeSettings();

    return {
        themeColor: settings.header_background_color,
    };
}

export async function generateMetadata({ params }: Props) {
    const newsroom = await app().newsroom();

    const faviconUrl = Newsrooms.getFaviconUrl(newsroom, 180);

    return generateRootMetadata(
        {
            locale: params.localeCode,
            indexable: !process.env.VERCEL,
        },
        {
            icons: {
                shortcut: faviconUrl,
                apple: faviconUrl,
            },
        },
    );
}

export default async function MainLayout({ children, params }: Props) {
    const { code: localeCode, isoCode, direction } = Locale.from(params.localeCode);
    return (
        <html lang={isoCode} dir={direction}>
            <head>
                <meta name="og:locale" content={isoCode} />
                <Preconnect />
                <Branding />
            </head>
            <body>
                <AppContext localeCode={localeCode}>
                    <Analytics />
                    <Notifications localeCode={localeCode} />
                    <div className={styles.layout}>
                        <Header localeCode={localeCode} />
                        <main className={styles.content}>{children}</main>
                        <SubscribeForm />
                        <Boilerplate localeCode={localeCode} />
                        <Footer localeCode={localeCode} />
                    </div>
                    <ScrollToTopButton />
                    <CookieConsent localeCode={localeCode} />
                </AppContext>
            </body>
        </html>
    );
}

async function AppContext(props: { children: ReactNode; localeCode: Locale.Code }) {
    const { localeCode, children } = props;

    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(localeCode);
    const brandName = languageSettings.company_information.name || newsroom.name;
    const settings = await app().themeSettings();
    const { isTrackingEnabled } = analytics();

    return (
        <RoutingProvider>
            <IntlProvider localeCode={localeCode}>
                <BroadcastStoryProvider>
                    <BroadcastGalleryProvider>
                        <AnalyticsProvider isEnabled={isTrackingEnabled} newsroom={newsroom}>
                            <StoryImageFallbackProvider
                                image={newsroom.newsroom_logo}
                                text={brandName}
                            >
                                <CategoryImageFallbackProvider
                                    image={newsroom.newsroom_logo}
                                    text={brandName}
                                >
                                    <ThemeSettingsProvider settings={settings}>
                                        <BroadcastPageTypesProvider>
                                            <BroadcastNotificationsProvider>
                                                <BroadcastTranslationsProvider>
                                                    {children}
                                                </BroadcastTranslationsProvider>
                                            </BroadcastNotificationsProvider>
                                        </BroadcastPageTypesProvider>
                                    </ThemeSettingsProvider>
                                </CategoryImageFallbackProvider>
                            </StoryImageFallbackProvider>
                        </AnalyticsProvider>
                    </BroadcastGalleryProvider>
                </BroadcastStoryProvider>
            </IntlProvider>
        </RoutingProvider>
    );
}
