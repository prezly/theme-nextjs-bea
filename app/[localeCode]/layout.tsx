import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { Boilerplate } from '@/modules/Boilerplate';
import { CookieConsent } from '@/modules/CookieConsent';
import { Footer } from '@/modules/Footer';
import { Notifications } from '@/modules/Notifications';
import { SubscribeForm } from '@/modules/SubscribeForm';

import styles from './layout.module.scss';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
    header: ReactNode;
    main: ReactNode;
}

export default async function MainLayout({ header, main }: Props) {
    return (
        <>
            <Notifications />
            <CookieConsent />
            <div className={styles.layout}>
                {header}
                <main className={styles.content}>{main}</main>
                <SubscribeForm />
                <Boilerplate />
                <Footer />
            </div>
        </>
    );
}
