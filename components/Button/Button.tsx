import classNames from 'classnames';
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from 'react';

import { IconLoading } from '@/icons';

import Link from './Link';
import { BaseProps } from './types';

import styles from './Button.module.scss';

interface Props extends BaseProps {
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    isLoading?: boolean;
    isDisabled?: boolean;
    isActive?: boolean;
    onClick?: () => void;
}

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>(
    (
        {
            variation,
            className,
            type = 'button',
            icon: IconComponent,
            iconPlacement = 'left',
            isLoading,
            isDisabled,
            isActive,
            onClick,
            children,
        },
        ref,
    ) => (
        <button
            ref={ref}
            // eslint-disable-next-line react/button-has-type
            type={type}
            className={classNames(styles.button, className, {
                [styles.primary]: variation === 'primary',
                [styles.secondary]: variation === 'secondary',
                [styles.navigation]: variation === 'navigation',
                [styles.loading]: isLoading,
                [styles.active]: isActive,
            })}
            onClick={onClick}
            disabled={isDisabled || isLoading}
        >
            {isLoading && <IconLoading className={styles.loadingIcon} />}
            {!isLoading && IconComponent && iconPlacement === 'left' && (
                <IconComponent className={classNames(styles.icon, styles.left)} />
            )}
            {children}
            {!isLoading && IconComponent && iconPlacement === 'right' && (
                <IconComponent className={classNames(styles.icon, styles.right)} />
            )}
        </button>
    ),
);
Button.displayName = 'Button';

export default Object.assign(Button, {
    Link,
});
