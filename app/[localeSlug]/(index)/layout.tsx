import type { ReactNode } from 'react';

import { Contacts } from '@/modules/Contacts';

import { resolve } from './resolve';

import styles from './layout.module.scss';

interface Props {
    children: ReactNode;
    params: {
        localeSlug: string;
    };
}

export default async function HomepageLayout({ params, children }: Props) {
    const { localeCode } = await resolve(params);

    return (
        <>
            {children}
            <hr className={styles.divider} />
            <Contacts localeCode={localeCode} />
        </>
    );
}
