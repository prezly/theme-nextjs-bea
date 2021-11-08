import { FunctionComponent } from 'react';

import styles from './PageTitle.module.scss';

interface Props {
    title: string;
    subtitle?: string | null;
}

const PageTitle: FunctionComponent<Props> = ({ title, subtitle }) => (
    <div className={styles.background}>
        <div className={styles.container}>
            <div className={styles.title}>{title}</div>
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
    </div>
);

export default PageTitle;
