'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

import { MadeWithPrezly } from '@/components/MadeWithPrezly';
import { parseBoolean } from '@/utils';

import styles from './Footer.module.scss';

interface Props {
    children: ReactNode;
    isWhiteLabeled: boolean;
}

export function Footer({ children, ...props }: Props) {
    const searchParams = useSearchParams();
    const isPreviewMode = process.env.PREZLY_MODE === 'preview';

    let { isWhiteLabeled } = props;
    if (isPreviewMode && searchParams.has('is_white_labeled')) {
        isWhiteLabeled = parseBoolean(searchParams.get('is_white_labeled'));
    }

    return (
        <footer className={styles.container}>
            <div className="container">
                <div className={styles.footer}>
                    <div className={styles.links}>{children}</div>
                    {!isWhiteLabeled && <MadeWithPrezly />}
                </div>
            </div>
        </footer>
    );
}
