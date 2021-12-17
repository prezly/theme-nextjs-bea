import classNames from 'classnames';
import NextLink, { LinkProps } from 'next/link';
import React, { forwardRef, HTMLProps, PropsWithChildren } from 'react';

import { useGetLinkLocaleSlug } from '@/hooks/useGetLinkLocaleSlug';
import { LocaleObject } from '@/utils/localeObject';

import Icon from './Icon';
import { BaseProps } from './types';

import styles from './Button.module.scss';

interface Props extends BaseProps, HTMLProps<HTMLAnchorElement> {
    href: string;
    localeCode?: LinkProps['locale'];
    iconOnly?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, PropsWithChildren<Props>>(
    (
        {
            children,
            className,
            href,
            icon,
            iconPlacement = 'left',
            variation,
            localeCode,
            iconOnly,
            ...props
        },
        ref,
    ) => {
        const getLinkLocaleSlug = useGetLinkLocaleSlug();
        const localeUrl = localeCode
            ? getLinkLocaleSlug(LocaleObject.fromAnyCode(localeCode))
            : localeCode;

        return (
            <NextLink href={href} locale={localeUrl} passHref>
                <a
                    ref={ref}
                    className={classNames(styles.button, className, {
                        [styles.primary]: variation === 'primary',
                        [styles.secondary]: variation === 'secondary',
                        [styles.navigation]: variation === 'navigation',
                        [styles.iconOnly]: iconOnly || (Boolean(icon) && !children),
                    })}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                >
                    {iconPlacement === 'left' && <Icon icon={icon} placement="left" />}
                    {children && <span className={styles.label}>{children}</span>}
                    {iconPlacement === 'right' && <Icon icon={icon} placement="right" />}
                </a>
            </NextLink>
        );
    },
);
Link.displayName = 'Button.Link';

export default Link;
