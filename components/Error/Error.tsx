import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './Error.module.scss';

interface Props {
    action?: ReactNode;
    className?: string;
    description?: ReactNode;
    statusCode: number;
    title: ReactNode;
}

export function Error({ action, className, description, statusCode, title }: Props) {
    return (
        <div className={classNames(styles.error, className)}>
            <div className={styles.statusCode}>{statusCode}</div>
            <h1 className={styles.title}>{title}</h1>
            {description && <div className={styles.description}>{description}</div>}
            {action && <div className={styles.action}>{action}</div>}
        </div>
    );
}
