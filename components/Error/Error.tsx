import React, { FunctionComponent, ReactNode } from 'react';

import styles from './Error.module.scss';

interface Props {
    action?: ReactNode;
    description?: string;
    statusCode: number;
    title: string;
}

const Error: FunctionComponent<Props> = ({ action, description, statusCode, title }) => (
    <div className={styles.error}>
        <h1>{statusCode}</h1>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        {action}
    </div>
);

export default Error;
