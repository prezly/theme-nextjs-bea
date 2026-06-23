import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './PageTitle.module.scss';

interface Props {
    title: string;
    subtitle?: ReactNode;
    className?: string;
    as?: 'h1' | 'h2';
}

export function PageTitle({ title, subtitle, className, as: Heading = 'h1' }: Props) {
    return (
        <div className={classNames(styles.container, className)}>
            <Heading className={styles.title}>{title}</Heading>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
    );
}
