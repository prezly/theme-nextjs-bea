import { FunctionComponent, ReactChild } from 'react';

import styles from './PageTitle.module.scss';

interface Props {
    title: string;
    subtitle?: ReactChild | null;
}

const PageTitle: FunctionComponent<Props> = ({ title, subtitle }) => (
    <div className={styles.background}>
        <div className={styles.container}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
    </div>
);

export default PageTitle;
