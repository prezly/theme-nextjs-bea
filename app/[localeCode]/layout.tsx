import { Analytics } from '@prezly/analytics-nextjs';
import { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

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

export async function generateMetadata() {
    return generateRootMetadata({ indexable: !process.env.VERCEL });
}

interface Props {
    params: {
        localeCode: Locale.Code;
    };
    children: ReactNode;
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
                    <Notifications />
                    <CookieConsent localeCode={params.localeCode} />
                    <div className={styles.layout}>
                        <Header localeCode={params.localeCode} />
                        <main className={styles.content}>{children}</main>
                        <SubscribeForm />
                        <Boilerplate localeCode={params.localeCode} />
                        <Footer />
                    </div>
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
        <RoutingProvider>
            <IntlProvider>
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
            </IntlProvider>
        </RoutingProvider>
    );
}
