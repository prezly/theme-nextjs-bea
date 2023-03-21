import { IconLoading } from '@prezly/icons';
import classNames from 'classnames';

import type { BaseProps } from './types';

import styles from './Button.module.scss';

interface Props {
    icon?: BaseProps['icon'];
    isLoading?: boolean;
    placement: 'left' | 'right';
}

export function Icon({ icon: IconComponent, isLoading, placement }: Props) {
    const isLeft = placement === 'left';
    const isRight = placement === 'right';

    if (isLoading) {
        return (
            <IconLoading
                width={16}
                height={16}
                className={classNames(styles.icon, styles.loading, {
                    [styles.left]: isLeft,
                    [styles.right]: isRight,
                })}
            />
        );
    }

    if (IconComponent) {
        return (
            <IconComponent
                width={16}
                height={16}
                className={classNames(styles.icon, {
                    [styles.left]: isLeft,
                    [styles.right]: isRight,
                })}
            />
        );
    }

    return null;
}
