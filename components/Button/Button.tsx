import classNames from 'classnames';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { Icon } from './Icon';
import type { CommonButtonProps } from './types';

import styles from './Button.module.scss';

export interface Props
    extends CommonButtonProps,
        Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onResize' | 'onResizeCapture'> {
    children?: ReactNode;
    loading?: boolean;
    contentClassName?: string;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
    (
        {
            variation,
            className,
            type = 'button',
            icon,
            iconPlacement = 'left',
            loading,
            disabled,
            onClick,
            children,
            contentClassName,
            ...attributes
        },
        forwardedRef,
    ) => (
        <button
            ref={forwardedRef}
            type={type}
            className={classNames(styles.button, className, {
                [styles.primary]: variation === 'primary',
                [styles.secondary]: variation === 'secondary',
                [styles.navigation]: variation === 'navigation',
                [styles.loading]: loading,
                [styles.iconOnly]: Boolean(icon) && !children,
            })}
            onClick={onClick}
            disabled={disabled || loading}
            {...attributes}
        >
            {iconPlacement === 'left' && <Icon icon={icon} loading={loading} placement="left" />}
            {/* If there are no children, we insert a zero-width space to preserve the line-height */}
            <span className={contentClassName}>{children ?? <>&#8203;</>}</span>
            {iconPlacement === 'right' && <Icon icon={icon} loading={loading} placement="right" />}
        </button>
    ),
);

Button.displayName = 'Button';
