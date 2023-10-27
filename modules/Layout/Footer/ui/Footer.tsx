import type { ReactNode } from 'react';

import { MadeWithPrezly } from '@/components/MadeWithPrezly';

import styles from './Footer.module.scss';

interface Props {
    children: ReactNode;
    isWhiteLabel: boolean;
}

export function Footer({ children, isWhiteLabel }: Props) {
    return (
        <footer className={styles.container}>
            <div className="container">
                <div className={styles.footer}>
                    <div className={styles.links}>{children}</div>
                    {!isWhiteLabel && <MadeWithPrezly />}
                </div>
            </div>
        </footer>
    );
}
