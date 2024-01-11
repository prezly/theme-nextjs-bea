import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { Contacts } from '@/modules/Contacts';

import styles from './layout.module.scss';

interface Props {
    children: ReactNode;
    params: {
        localeCode: Locale.Code;
    };
}

export default async function HomepageLayout({ params, children }: Props) {
    return (
        <>
            {children}
            <hr className={styles.divider} />
            <Contacts localeCode={params.localeCode} />
        </>
    );
}
