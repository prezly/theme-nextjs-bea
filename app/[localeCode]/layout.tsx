import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { CookieConsent } from '@/modules/CookieConsent';
import { Notifications } from '@/modules/Notifications';

import styles from './layout.module.scss';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
    header: ReactNode;
    main: ReactNode;
    footer: ReactNode;
}

export default async function MainLayout({ header, main, footer }: Props) {
    return (
        <>
            <Notifications />
            <CookieConsent />
            <div className={styles.layout}>
                {header}
                <main className={styles.content}>{main}</main>
                {footer}
            </div>
        </>
    );
}
