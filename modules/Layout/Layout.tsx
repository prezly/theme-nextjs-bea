import { Analytics } from '@prezly/analytics-nextjs';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { app } from '@/theme/server';

import { Boilerplate } from './Boilerplate';
import { Footer } from './Footer';
import { Notifications } from './Notifications';
import { SubscribeForm } from './SubscribeForm';

import styles from './Layout.module.scss';

interface Props {
    children: ReactNode;
    // hasError?: boolean;
    isPreviewUrl?: boolean;
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

export async function Layout({ isPreviewUrl = false, children /* hasError */ }: Props) {
    const localeCode = app().locale();
    const language = await app().languageOrDefault(localeCode);

    return (
        <>
            <Analytics />
            <Notifications isPreviewUrl={isPreviewUrl} />
            <CookieConsentBar>{language.company_information.cookie_statement}</CookieConsentBar>
            <div className={styles.layout}>
                {children}
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
            <ScrollToTopButton />
        </>
    );
}

export function Content(props: { children: ReactNode }) {
    return <main className={styles.content}>{props.children}</main>;
}
