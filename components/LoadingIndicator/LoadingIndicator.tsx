import classNames from 'classnames';
import { FunctionComponent } from 'react';

import styles from './LoadingIndicator.module.scss';

interface Props {
    className?: string;
}

const LoadingIndicator: FunctionComponent<Props> = ({ className }) => (
    <div className={classNames(className, styles.loadingIndicator)}>
        <div className={styles.dot} />
        <div className={styles.dot} />
        <div className={styles.dot} />
    </div>
);

export default LoadingIndicator;
