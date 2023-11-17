import type { ReactNode } from 'react';

import { Boilerplate } from './Boilerplate';
import { Footer } from './Footer';
import { SubscribeForm } from './SubscribeForm';

import styles from './Layout.module.scss';

interface Props {
    header: ReactNode;
    children: ReactNode;
    // hasError?: boolean;
}

export async function Layout({ header, children /* hasError */ }: Props) {
    return (
        <div className={styles.layout}>
            {header}
            <main className={styles.content}>{children}</main>
            <SubscribeForm />
            <Boilerplate />
            <Footer />
        </div>
    );
}
