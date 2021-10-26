import classNames from 'classnames';
import React, { forwardRef, HTMLProps, PropsWithChildren } from 'react';

import { BaseProps } from './types';

import styles from './Button.module.scss';

interface Props extends BaseProps, HTMLProps<HTMLAnchorElement> {
    href: string;
}

const Link = forwardRef<HTMLAnchorElement, PropsWithChildren<Props>>(
    (
        {
            children,
            className,
            href,
            icon: IconComponent,
            iconPlacement = 'left',
            variation,
            ...props
        },
        ref,
    ) => (
        <a
            ref={ref}
            className={classNames(styles.button, className, {
                [styles.primary]: variation === 'primary',
                [styles.secondary]: variation === 'secondary',
                [styles.navigation]: variation === 'navigation',
            })}
            href={href}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        >
            {IconComponent && iconPlacement === 'left' && (
                <IconComponent className={classNames(styles.icon, styles.left)} />
            )}
            {children}
            {IconComponent && iconPlacement === 'right' && (
                <IconComponent className={classNames(styles.icon, styles.right)} />
            )}
        </a>
    ),
);
Link.displayName = 'Button.Link';

export default Link;
