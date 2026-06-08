'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

import { MadeWithPrezly } from '@/components/MadeWithPrezly';
import { usePreviewSettings } from '@/hooks';
import { parseBoolean } from '@/utils';

import styles from './Footer.module.scss';

interface Props {
    children: ReactNode;
    isWhiteLabeled: boolean;
}

export function Footer({ children, ...props }: Props) {
    const searchParams = useSearchParams();
    const previewSettings = usePreviewSettings();

    let { isWhiteLabeled } = props;
    if (previewSettings) {
        isWhiteLabeled = parseBoolean(previewSettings.is_white_labeled ?? String(isWhiteLabeled));
    } else if (process.env.PREZLY_MODE === 'preview' && searchParams.has('is_white_labeled')) {
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
