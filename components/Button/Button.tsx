import classNames from 'classnames';
import {
    ButtonHTMLAttributes,
    forwardRef,
    FunctionComponent,
    PropsWithChildren,
    SVGProps,
} from 'react';

import { IconLoading } from '@/icons';

import styles from './Button.module.scss';

type Props = {
    variation: 'primary' | 'secondary' | 'navigation';
    className?: string;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
    isLoading?: boolean;
    isDisabled?: boolean;
    isActive?: boolean;
    onClick?: () => void;
};

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>(
    (
        {
            variation,
            className,
            type = 'button',
            icon: IconComponent,
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
            {!isLoading && IconComponent && <IconComponent className={styles.icon} />}
            {children}
        </button>
    ),
);
Button.displayName = 'Button';

export default Button;
