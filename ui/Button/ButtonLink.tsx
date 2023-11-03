import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import { forwardRef } from 'react';

import { Link } from '@/components/Link';

import { Icon } from './Icon';
import type { BaseProps } from './types';

import styles from './Button.module.scss';

export interface LinkProps extends BaseProps, Link.Props {
    forceRefresh?: boolean;
}

export const ButtonLink = forwardRef<
    HTMLAnchorElement,
    Omit<PropsWithChildren<LinkProps>, 'onResize' | 'onResizeCapture'>
>(
    (
        {
            children,
            className,
            href,
            icon,
            iconPlacement = 'left',
            variation,
            forceRefresh,
            ...attributes
        },
        ref,
    ) => (
        <Link
            href={href}
            forwardRef={ref}
            className={classNames(styles.button, className, {
                [styles.primary]: variation === 'primary',
                [styles.secondary]: variation === 'secondary',
                [styles.navigation]: variation === 'navigation',
                [styles.iconOnly]: Boolean(icon) && !children,
            })}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...attributes}
        >
            {iconPlacement === 'left' && <Icon icon={icon} placement="left" />}
            {children && <span className={styles.label}>{children}</span>}
            {iconPlacement === 'right' && <Icon icon={icon} placement="right" />}
        </Link>
    ),
);

ButtonLink.displayName = 'ButtonLink';
