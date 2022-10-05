import classNames from 'clsx';
import type { ReactNode } from 'react';

import styles from './PageTitle.module.scss';

interface Props {
    title: string;
    subtitle?: ReactNode;
    className?: string;
}

function PageTitle({ title, subtitle, className }: Props) {
    return (
        <div className={classNames(styles.container, className)}>
            <h1 className={classNames(styles.title, 'text-gray-700 dark:text-white')}>{title}</h1>
            {subtitle && (
                <p className={classNames(styles.subtitle, 'dark:text-gray-300')}>{subtitle}</p>
            )}
        </div>
    );
}

export default PageTitle;
