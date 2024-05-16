'use client';

import { useSearchParams } from 'next/navigation';

import styles from './PreviewPageMask.module.scss';

export function PreviewPageMask() {
    const searchParams = useSearchParams();
    const preview = JSON.parse(searchParams.get('preview') ?? 'false');

    if (!preview) {
        return null;
    }

    return <div className={styles.mask} />;
}
