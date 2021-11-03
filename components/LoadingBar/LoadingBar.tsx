import classNames from 'classnames';
import { FunctionComponent } from 'react';

import styles from './LoadingBar.module.scss';

interface Props {
    isLoading: boolean;
}

const LoadingBar: FunctionComponent<Props> = ({ isLoading }) => (
    <div className={classNames(styles.bar, { [styles.visible]: isLoading })} />
);

export default LoadingBar;
