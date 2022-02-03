import classNames from 'classnames';

import { IconLoading } from 'icons';

import type { BaseProps } from './types';

import styles from './Button.module.scss';

interface Props {
    icon?: BaseProps['icon'];
    isLoading?: boolean;
    placement: 'left' | 'right';
}

function Icon({ icon: IconComponent, isLoading, placement }: Props) {
    const isLeft = placement === 'left';
    const isRight = placement === 'right';

    if (isLoading) {
        return (
            <IconLoading
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
                className={classNames(styles.icon, {
                    [styles.left]: isLeft,
                    [styles.right]: isRight,
                })}
            />
        );
    }

    return null;
}

export default Icon;
