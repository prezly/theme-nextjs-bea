import classNames from 'classnames';
import { ButtonHTMLAttributes, FunctionComponent, ReactNode } from 'react';

import { IconLoading } from '@/icons';

import styles from './Button.module.scss';

type Props = {
    variation: 'primary' | 'secondary' | 'navigation';
    className?: string;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    icon?: ReactNode;
    isLoading?: boolean;
    isDisabled?: boolean;
    isActive?: boolean;
    onClick?: () => void;
};

const Button: FunctionComponent<Props> = ({
    variation,
    className,
    type = 'button',
    icon,
    isLoading,
    isDisabled,
    isActive,
    onClick,
    children,
}) => (
    <button
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
        {isLoading ? <IconLoading className={styles.loadingIcon} /> : icon}
        {children}
    </button>
);

export default Button;
