// import { Analytics } from '@prezly/analytics-nextjs';
// import { Story } from '@prezly/sdk';
// import {
//     PageSeo,
// } from '@prezly/theme-kit-nextjs';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import { api, locale } from '@/theme-kit';
import { ScrollToTopButton } from '@/ui';

import { Boilerplate } from './Boilerplate';
import { Contacts } from './Contacts';
import { Footer } from './Footer';
import { Header } from './Header';
import { Notifications } from './Notifications';
import { SubscribeForm } from './SubscribeForm';

import styles from './Layout.module.scss';

interface Props {
    children: ReactNode;
    // description?: string;
    // imageUrl?: string;
    // title?: string;
    // hasError?: boolean;
    isPreviewUrl?: boolean;
}

const CookieConsentBar = dynamic(() => import('./CookieConsentBar'), {
    ssr: false,
});

/*
const noIndex = process.env.VERCEL === '1';
 */

export async function Layout({ isPreviewUrl = false, children /* hasError */ }: Props) {
    const { contentDelivery } = api();
    const localeCode = locale().code;
    const language = await contentDelivery.languageOrDefault(localeCode);

    return (
        <>
            {/*
            <Analytics />
            <PageSeo
                noindex={noIndex}
                nofollow={noIndex}
                title={title}
                description={description}
                imageUrl={imageUrl}
            />
            */}
            <Notifications isPreviewUrl={isPreviewUrl} />
            <CookieConsentBar>{language.company_information.cookie_statement}</CookieConsentBar>
            <div className={styles.layout}>
                <Header />
                <main className={styles.content}>{children}</main>
                <Contacts />
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
            <ScrollToTopButton />
        </>
    );
}
