import classNames from 'classnames';
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from 'react';

import LeftIcon from './LeftIcon';
import Link from './Link';
import RightIcon from './RightIcon';
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
            icon,
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
            {iconPlacement === 'left' && <LeftIcon icon={icon} isLoading={isLoading} />}
            {children}
            {iconPlacement === 'right' && <RightIcon icon={icon} isLoading={isLoading} />}
        </button>
    ),
);
Button.displayName = 'Button';

export default Object.assign(Button, {
    Link,
});
