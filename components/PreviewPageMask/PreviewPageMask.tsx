'use client';

import { useSearchParams } from 'next/navigation';

import styles from './PreviewPageMask.module.scss';

export function PreviewPageMask() {
    const searchParams = useSearchParams();
    const mask = JSON.parse(searchParams.get('mask') || 'false');

    if (!mask) {
        return null;
    }

    return <div className={styles.mask} />;
}
