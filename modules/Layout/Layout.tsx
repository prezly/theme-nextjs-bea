import Head from 'next/head';
import { Router } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';

import { LoadingBar, PageSeo } from '@/components';
import { useCompanyInformation, useNewsroom } from '@/hooks';
import { getAbsoluteUrl } from '@/utils';
import { getAssetsUrl, getNewsroomLogoUrl } from '@/utils/prezly';

import Boilerplate from './Boilerplate';
import Footer from './Footer';
import Header from './Header';
import SubscribeForm from './SubscribeForm';

import styles from './Layout.module.scss';

interface Props {
    description?: string;
    imageUrl?: string;
    title?: string;
    url?: string;
}

const Layout: FunctionComponent<Props> = ({ children, description, imageUrl, title, url }) => {
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const companyInformation = useCompanyInformation();
    const newsroom = useNewsroom();

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
            <Head>
                {newsroom.icon && (
                    <link rel="shortcut icon" href={getAssetsUrl(newsroom.icon.uuid)} />
                )}
            </Head>
            <PageSeo
                title={title || companyInformation.name}
                description={description}
                url={getAbsoluteUrl(url, newsroom.url)}
                imageUrl={imageUrl || getNewsroomLogoUrl(newsroom)}
                siteName={companyInformation.name}
            />
            <div className={styles.layout}>
                <Header />
                <main className={styles.content}>
                    {children}
                    <LoadingBar isLoading={isLoadingPage} />
                </main>
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
        </>
    );
};
export default Layout;
