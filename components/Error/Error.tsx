import classNames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import styles from './Error.module.scss';

interface Props {
    action?: ReactNode;
    className?: string;
    description?: string;
    statusCode: number;
    title: string;
}

const Error: FunctionComponent<Props> = ({ action, className, description, statusCode, title }) => (
    <div className={classNames(styles.error, className)}>
        <div className={styles.statusCode}>{statusCode}</div>
        <h1 className={styles.title}>{title}</h1>
        {description && <div className={styles.description}>{description}</div>}
        {action && <div className={styles.action}>{action}</div>}
    </div>
);

export default Error;
