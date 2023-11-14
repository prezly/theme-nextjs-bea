import classNames from 'classnames';

import type { IconComponentType } from '@/icons';
import { IconLoading } from '@/icons';

import styles from './Button.module.scss';

export function Icon({ icon: IconComponent, loading, placement }: Icon.Props) {
    const isLeft = placement === 'left';
    const isRight = placement === 'right';

    if (loading) {
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

export namespace Icon {
    export interface Props {
        icon?: IconComponentType;
        loading?: boolean;
        placement: 'left' | 'right';
    }
}
