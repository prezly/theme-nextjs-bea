import { Locale, Newsrooms } from '@prezly/theme-kit-nextjs';
import type { Viewport } from 'next';
import type { ReactNode } from 'react';

import { ThemeSettingsProvider } from '@/adapters/client';
import { analytics, app, generateRootMetadata, themeSettings } from '@/adapters/server';
import { CategoryImageFallbackProvider } from '@/components/CategoryImage';
import { PreviewPageMask } from '@/components/PreviewPageMask';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { StoryImageFallbackProvider } from '@/components/StoryImage';
import { WindowScrollListener } from '@/components/WindowScrollListener';
import { Analytics } from '@/modules/Analytics';
import { Boilerplate } from '@/modules/Boilerplate';
import {
    BroadcastGalleryProvider,
    BroadcastNotificationsProvider,
    BroadcastPageTypesProvider,
    BroadcastStoryProvider,
    BroadcastTranslationsProvider,
} from '@/modules/Broadcast';
import { CookieConsentProvider } from '@/modules/CookieConsent';
import { CookieConsent } from '@/modules/CookieConsent/CookieConsent';
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
    params: Promise<{
        localeCode: Locale.Code;
    }>;
    children: ReactNode;
}

export async function generateViewport(): Promise<Viewport> {
    const settings = await themeSettings();

    return {
        themeColor: settings.header_background_color,
    };
}

export async function generateMetadata(props: Props) {
    const params = await props.params;
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

export default async function MainLayout(props: Props) {
    const params = await props.params;

    const { children } = props;

    const { code: localeCode, isoCode, direction } = Locale.from(params.localeCode);
    const { isTrackingEnabled } = analytics();
    const newsroom = await app().newsroom();

    return (
        <html lang={isoCode} dir={direction}>
            <head>
                <meta name="og:locale" content={isoCode} />
                <Preconnect />
                <Branding />
            </head>
            <body>
                <AppContext localeCode={localeCode}>
                    {isTrackingEnabled && (
                        <Analytics
                            meta={{
                                newsroom: newsroom.uuid,
                                tracking_policy: newsroom.tracking_policy,
                            }}
                            trackingPolicy={newsroom.tracking_policy}
                            plausible={{
                                isEnabled: newsroom.is_plausible_enabled,
                                siteId: newsroom.plausible_site_id,
                            }}
                            segment={{ writeKey: newsroom.segment_analytics_id }}
                            google={{ analyticsId: newsroom.google_analytics_id }}
                        />
                    )}
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
                    <PreviewPageMask />
                    <WindowScrollListener />
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

    return (
        <RoutingProvider>
            <IntlProvider localeCode={localeCode}>
                <BroadcastStoryProvider>
                    <BroadcastGalleryProvider>
                        <CookieConsentProvider trackingPolicy={newsroom.tracking_policy}>
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
                        </CookieConsentProvider>
                    </BroadcastGalleryProvider>
                </BroadcastStoryProvider>
            </IntlProvider>
        </RoutingProvider>
    );
}
