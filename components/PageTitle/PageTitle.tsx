import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './PageTitle.module.scss';

interface Props {
    title: string;
    subtitle?: ReactNode;
    className?: string;
}

export function PageTitle({ title, subtitle, className }: Props) {
    return (
        <div className={classNames(styles.container, className)}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
    );
}
