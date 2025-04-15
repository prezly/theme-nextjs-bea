import classNames from 'classnames';

import styles from './LoadingBar.module.scss';

interface Props {
    isLoading: boolean;
    className?: string;
}

export function LoadingBar({ isLoading, className }: Props) {
    return <div className={classNames(styles.bar, { [styles.visible]: isLoading }, className)} />;
}
