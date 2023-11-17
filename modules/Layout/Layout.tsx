import { Analytics } from '@prezly/analytics-nextjs';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import { app } from '@/adapters/server';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

import { Boilerplate } from './Boilerplate';
import { Footer } from './Footer';
import { Notifications } from './Notifications';
import { SubscribeForm } from './SubscribeForm';

import styles from './Layout.module.scss';

interface Props {
    header: ReactNode;
    children: ReactNode;
    // hasError?: boolean;
}

const CookieConsentBar = dynamic(
    async () => {
        const component = await import('./CookieConsentBar');
        return { default: component.CookieConsentBar };
    },
    {
        ssr: false,
    },
);

export async function Layout({ header, children /* hasError */ }: Props) {
    const localeCode = app().locale();
    const language = await app().languageOrDefault(localeCode);

    return (
        <>
            <Analytics />
            <Notifications />
            <CookieConsentBar>{language.company_information.cookie_statement}</CookieConsentBar>
            <div className={styles.layout}>
                {header}
                <main className={styles.content}>{children}</main>
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
            <ScrollToTopButton />
        </>
    );
}
