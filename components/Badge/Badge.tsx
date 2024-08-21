import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './Badge.module.scss';

type Props = {
    children: ReactNode;
    className?: string;
    size: 'small';
    variant?: 'outline';
};

export function Badge({ children, className, size = 'small', variant = 'outline' }: Props) {
    return (
        <span
            className={classNames(styles.badge, className, {
                [styles.small]: size === 'small',
                [styles.outline]: variant === 'outline',
            })}
        >
            {children}
        </span>
    );
}
