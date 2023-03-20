import classNames from 'classnames';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { forwardRef } from 'react';

import { Icon } from './Icon';
import type { BaseProps } from './types';

import styles from './Button.module.scss';

export interface ButtonProps extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
    contentClassName?: string;
}

export const Button = forwardRef<
    HTMLButtonElement,
    Omit<PropsWithChildren<ButtonProps>, 'onResize' | 'onResizeCapture'>
>(
    (
        {
            variation,
            className,
            type = 'button',
            icon,
            iconPlacement = 'left',
            isLoading,
            isDisabled,
            onClick,
            children,
            contentClassName,
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
            {/* If there are no children, we insert a zero-width space to preserve the line-height */}
            <span className={contentClassName}>{children ?? <>&#8203;</>}</span>
            {iconPlacement === 'right' && (
                <Icon icon={icon} isLoading={isLoading} placement="right" />
            )}
        </button>
    ),
);

Button.displayName = 'Button';
