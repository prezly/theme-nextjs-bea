'use client';

import { useSearchParams } from 'next/navigation';
import { type ReactNode, useMemo } from 'react';

import { MadeWithPrezly } from '@/components/MadeWithPrezly';
import { parseBoolean } from 'utils';

import styles from './Footer.module.scss';

interface Props {
    children: ReactNode;
    isWhiteLabeled: boolean;
}

export function Footer({ children, ...props }: Props) {
    const searchParams = useSearchParams();

    const isWhiteLabeled = useMemo(() => {
        const isWhiteLabeledPreview = searchParams.get('is_white_labeled');
        if (isWhiteLabeledPreview) {
            return parseBoolean(isWhiteLabeledPreview);
        }

        return props.isWhiteLabeled;
    }, [props.isWhiteLabeled, searchParams]);

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
