import classNames from 'classnames';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { forwardRef } from 'react';

import { makeComposableComponent } from '@/utils';

import Icon from './Icon';
import Link from './Link';
import type { BaseProps } from './types';

import styles from './Button.module.scss';

interface Props extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
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
            icon,
            iconPlacement = 'left',
            isLoading,
            isDisabled,
            isActive,
            onClick,
            children,
            ...buttonProps
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
                [styles.iconOnly]: Boolean(icon) && !children,
            })}
            onClick={onClick}
            disabled={isDisabled || isLoading}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...buttonProps}
        >
            {iconPlacement === 'left' && (
                <Icon icon={icon} isLoading={isLoading} placement="left" />
            )}
            {children && <span className={styles.label}>{children}</span>}
            {iconPlacement === 'right' && (
                <Icon icon={icon} isLoading={isLoading} placement="right" />
            )}
        </button>
    ),
);
Button.displayName = 'Button';

export default makeComposableComponent(Button, { Link });
