// import { Analytics } from '@prezly/analytics-nextjs';
import dynamic from 'next/dynamic';
// import { Router } from 'next/router';
import type { ReactNode } from 'react';

import { api, locale } from '@/theme-kit';
import { /* LoadingBar, */ ScrollToTopButton } from '@/ui';

import { Boilerplate } from './Boilerplate';
import { Contacts } from './Contacts';
import { Footer } from './Footer';
import { Header } from './Header';
import { Notifications } from './Notifications';
import { SubscribeForm } from './SubscribeForm';

import styles from './Layout.module.scss';

interface Props {
    children: ReactNode;
    isPreviewUrl?: boolean;
}

const CookieConsentBar = dynamic(() => import('./CookieConsentBar'), {
    ssr: false,
});

export async function Layout({ isPreviewUrl = false, children /* hasError */ }: Props) {
    const { contentDelivery } = api();

    const localeCode = locale().code;

    const newsroom = await contentDelivery.newsroom();
    const language = await contentDelivery.languageOrDefault(localeCode);

    /*
    const [isLoadingPage, setIsLoadingPage] = useState(false);

    useEffect(() => {
        function onRouteChangeStart() {
            setIsLoadingPage(true);
        }

        function routeChangeComplete() {
            setIsLoadingPage(false);
        }

        Router.events.on('routeChangeStart', onRouteChangeStart);
        Router.events.on('routeChangeComplete', routeChangeComplete);
        return () => {
            Router.events.off('routeChangeStart', onRouteChangeStart);
            Router.events.off('routeChangeComplete', routeChangeComplete);
        };
    }, []);
     */

    return (
        <>
            {/*
            <Analytics />
            */}
            <Notifications isPreviewUrl={isPreviewUrl} />
            <CookieConsentBar>{language.company_information.cookie_statement}</CookieConsentBar>
            <div className={styles.layout}>
                <Header newsroom={newsroom} companyInformation={language.company_information} />
                <main className={styles.content}>
                    {children}
                    {/*
                    <LoadingBar isLoading={isLoadingPage} />
                    */}
                </main>
                <Contacts />
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
            <ScrollToTopButton />
        </>
    );
}
