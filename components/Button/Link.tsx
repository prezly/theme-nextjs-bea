import classNames from 'classnames';
import NextLink, { LinkProps } from 'next/link';
import React, { forwardRef, HTMLProps, PropsWithChildren } from 'react';

import { useGetLinkLocaleSlug } from '@/hooks/useGetLinkLocaleSlug';
import { LocaleObject } from '@/utils/localeObject';

import { BaseProps } from './types';

import styles from './Button.module.scss';

interface Props extends BaseProps, HTMLProps<HTMLAnchorElement> {
    href: string;
    localeCode?: LinkProps['locale'];
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
            localeCode,
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
                    })}
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
            </NextLink>
        );
    },
);
Link.displayName = 'Button.Link';

export default Link;
