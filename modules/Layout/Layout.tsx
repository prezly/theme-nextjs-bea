import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Router, useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';

import { LoadingBar, PageSeo } from '@/components';
import { useNewsroomContext } from '@/contexts/newsroom';
import { useCompanyInformation, useNewsroom } from '@/hooks';
import { Analytics } from '@/modules/analytics';
import { getAbsoluteUrl } from '@/utils';
import { getAssetsUrl, getNewsroomLogoUrl } from '@/utils/prezly';

import Boilerplate from './Boilerplate';
import Contacts from './Contacts';
import Footer from './Footer';
import Header from './Header';
import SubscribeForm from './SubscribeForm';

import styles from './Layout.module.scss';

interface Props {
    description?: string;
    imageUrl?: string;
    title?: string;
}

const CookieConsentBar = dynamic(() => import('@/modules/analytics/components/CookieConsentBar'), {
    ssr: false,
});

const Layout: FunctionComponent<Props> = ({ children, description, imageUrl, title }) => {
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const companyInformation = useCompanyInformation();
    const newsroom = useNewsroom();
    const { contacts } = useNewsroomContext();
    const { asPath } = useRouter();

    useEffect(() => {
        const onRouteChangeStart = () => {
            setIsLoadingPage(true);
        };
        const routeChangeComplete = () => {
            setIsLoadingPage(false);
        };

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
            <Head>
                {newsroom.icon && (
                    <link rel="shortcut icon" href={getAssetsUrl(newsroom.icon.uuid)} />
                )}
            </Head>
            <PageSeo
                title={title || companyInformation.name}
                description={description}
                url={getAbsoluteUrl(asPath, newsroom.url)}
                imageUrl={imageUrl || getNewsroomLogoUrl(newsroom)}
                siteName={companyInformation.name}
            />
            <CookieConsentBar />
            <div className={styles.layout}>
                <Header />
                <main className={styles.content}>
                    {children}
                    <LoadingBar isLoading={isLoadingPage} />
                </main>
                {contacts && <Contacts contacts={contacts} />}
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
        </>
    );
};
export default Layout;
