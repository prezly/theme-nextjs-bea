import { Analytics } from '@prezly/analytics-nextjs';
import { PageSeo, useNewsroom, useNewsroomContext } from '@prezly/theme-kit-nextjs';
import { LoadingBar, ScrollToTopButton } from '@prezly/themes-ui-components';
import dynamic from 'next/dynamic';
import { Router } from 'next/router';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import Boilerplate from './Boilerplate';
import Branding from './Branding';
import Contacts from './Contacts';
import Footer from './Footer';
import Header from './Header';
import SubscribeForm from './SubscribeForm';

interface Props {
    description?: string;
    imageUrl?: string;
    title?: string;
    hasError?: boolean;
    hasHero?: boolean;
}

const CookieConsentBar = dynamic(() => import('./CookieConsentBar'), {
    ssr: false,
});

const Hero = dynamic(() => import('./Hero'));

function Layout({ children, description, imageUrl, title, hasHero }: PropsWithChildren<Props>) {
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const newsroom = useNewsroom();
    const { contacts } = useNewsroomContext();

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

    return (
        <>
            <Analytics />
            <Branding newsroom={newsroom} />
            <PageSeo title={title} description={description} imageUrl={imageUrl} />
            <CookieConsentBar />
            <div className="flex flex-col flex-1">
                <Header />
                <main className="flex flex-col flex-1 max-w-7xl mx-auto px-4 sm:px-6 sm:py-4 lg:px-8">
                    {hasHero && <Hero />}
                    {children}
                    <LoadingBar isLoading={isLoadingPage} />
                </main>
                {contacts && <Contacts contacts={contacts} />}
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
            <ScrollToTopButton
                iconClassName="!mt-0"
                className="dark:!bg-gray-600 dark:hover:!bg-gray-500 dark:text-white dark:border-gray-400"
            />
        </>
    );
}
export default Layout;
