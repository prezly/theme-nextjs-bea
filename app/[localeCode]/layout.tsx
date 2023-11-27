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

export default async function MainLayout({ children, params }: Props) {
    return (
        <>
            <Notifications />
            <CookieConsent localeCode={params.localeCode} />
            <div className={styles.layout}>
                <Header localeCode={params.localeCode} />
                <main className={styles.content}>{children}</main>
                <SubscribeForm />
                <Boilerplate localeCode={params.localeCode} />
                <Footer />
            </div>
        </>
    );
}
