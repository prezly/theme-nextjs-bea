import { Analytics } from '@prezly/analytics-nextjs';
import { Locale } from '@prezly/theme-kit-nextjs';
import { type ReactNode, Suspense } from 'react';

import { ThemeSettingsProvider } from '@/adapters/client';
import { app, generateRootMetadata } from '@/adapters/server';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { StoryImageFallbackProvider } from '@/components/StoryImage';
import { AnalyticsProvider } from '@/modules/Analytics';
import { Boilerplate } from '@/modules/Boilerplate';
import {
    BroadcastNotificationsProvider,
    BroadcastPageTypesProvider,
    BroadcastTranslationsProvider,
} from '@/modules/Broadcast';
import { CookieConsent } from '@/modules/CookieConsent';
import { Footer, FooterSkeleton } from '@/modules/Footer';
import { Branding, Preconnect } from '@/modules/Head';
import { Header, HeaderSkeleton } from '@/modules/Header';
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

export async function generateMetadata({ params }: Props) {
    return generateRootMetadata({
        locale: params.localeCode,
        indexable: !process.env.VERCEL,
    });
}

export default async function MainLayout({ children, params }: Props) {
    const { localeCode } = params;
    const { isoCode, direction } = Locale.from(localeCode);
    return (
        <html lang={isoCode} dir={direction}>
            <head>
                <meta name="og:locale" content={isoCode} />
                <Preconnect />
                {/* TODO: Decide if Suspense is needed here. Branding component does fetch data, but it's critical for layout rendering. */}
                <Branding />
            </head>
            <body>
                <AppContext localeCode={localeCode}>
                    <Analytics />
                    <Suspense>
                        <Notifications localeCode={localeCode} />
                        <CookieConsent localeCode={localeCode} />
                    </Suspense>
                    <div className={styles.layout}>
                        <Suspense fallback={<HeaderSkeleton />}>
                            <Header localeCode={localeCode} />
                        </Suspense>
                        <main className={styles.content}>
                            <Suspense fallback={<div>Content loading...</div>}>{children}</Suspense>
                        </main>
                        <Suspense fallback={<FooterSkeleton />}>
                            <SubscribeForm />
                            <Boilerplate localeCode={localeCode} />
                            <Footer localeCode={localeCode} />
                        </Suspense>
                    </div>
                    <ScrollToTopButton />
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
                <AnalyticsProvider>
                    <StoryImageFallbackProvider image={newsroom.newsroom_logo} text={brandName}>
                        <ThemeSettingsProvider settings={settings}>
                            <BroadcastPageTypesProvider>
                                <BroadcastNotificationsProvider>
                                    <BroadcastTranslationsProvider>
                                        {children}
                                    </BroadcastTranslationsProvider>
                                </BroadcastNotificationsProvider>
                            </BroadcastPageTypesProvider>
                        </ThemeSettingsProvider>
                    </StoryImageFallbackProvider>
                </AnalyticsProvider>
            </IntlProvider>
        </RoutingProvider>
    );
}
