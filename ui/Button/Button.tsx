import classNames from 'classnames';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

import { Icon } from './Icon';
import type { CommonButtonProps } from './types';

import styles from './Button.module.scss';

export function Button({
    variation,
    className,
    forwardRef,
    type = 'button',
    icon,
    iconPlacement = 'left',
    loading,
    disabled,
    onClick,
    children,
    contentClassName,
    ...attributes
}: Button.Props) {
    return (
        <button
            ref={forwardRef}
            // eslint-disable-next-line react/button-has-type
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
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...attributes}
        >
            {iconPlacement === 'left' && <Icon icon={icon} loading={loading} placement="left" />}
            {/* If there are no children, we insert a zero-width space to preserve the line-height */}
            <span className={contentClassName}>{children ?? <>&#8203;</>}</span>
            {iconPlacement === 'right' && <Icon icon={icon} loading={loading} placement="right" />}
        </button>
    );
}

export namespace Button {
    export interface Props
        extends CommonButtonProps,
            Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onResize' | 'onResizeCapture'> {
        children?: ReactNode;
        forwardRef?: Ref<HTMLButtonElement>;
        loading?: boolean;
        contentClassName?: string;
    }
}
