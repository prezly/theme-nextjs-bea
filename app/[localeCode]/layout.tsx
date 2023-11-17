import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { Boilerplate } from '@/modules/Boilerplate';
import { CookieConsent } from '@/modules/CookieConsent';
import { Footer } from '@/modules/Footer';
import { Header } from '@/modules/Header';
import { Notifications } from '@/modules/Notifications';
import { SubscribeForm } from '@/modules/SubscribeForm';

import styles from './layout.module.scss';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
    children: ReactNode;
}

export default async function MainLayout({ children }: Props) {
    return (
        <>
            <Notifications />
            <CookieConsent />
            <div className={styles.layout}>
                <Header />
                <main className={styles.content}>{children}</main>
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
        </>
    );
}
