import { LocaleObject } from '@prezly/theme-kit-core';
import { useGetLinkLocaleSlug } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import type { HTMLProps, PropsWithChildren } from 'react';
import { forwardRef } from 'react';

import { Icon } from './Icon';
import type { BaseProps } from './types';

import styles from './Button.module.scss';

export interface LinkProps extends BaseProps, HTMLProps<HTMLAnchorElement> {
    href: string;
    localeCode?: NextLinkProps['locale'];
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
            localeCode,
            forceRefresh,
            ...props
        },
        ref,
    ) => {
        const getLinkLocaleSlug = useGetLinkLocaleSlug();
        const localeUrl = localeCode
            ? getLinkLocaleSlug(LocaleObject.fromAnyCode(localeCode))
            : localeCode;

        function renderAnchorTag(linkHref?: string) {
            return (
                <a
                    href={linkHref}
                    ref={ref}
                    className={classNames(styles.button, className, {
                        [styles.primary]: variation === 'primary',
                        [styles.secondary]: variation === 'secondary',
                        [styles.navigation]: variation === 'navigation',
                        [styles.iconOnly]: Boolean(icon) && !children,
                    })}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                >
                    {iconPlacement === 'left' && <Icon icon={icon} placement="left" />}
                    {children && <span className={styles.label}>{children}</span>}
                    {iconPlacement === 'right' && <Icon icon={icon} placement="right" />}
                </a>
            );
        }

        if (forceRefresh) {
            const hrefWithLocale = localeUrl ? `/${localeUrl}${href.toString()}` : href.toString();

            return renderAnchorTag(hrefWithLocale);
        }

        return (
            <NextLink href={href} locale={localeUrl} passHref legacyBehavior>
                {renderAnchorTag()}
            </NextLink>
        );
    },
);

ButtonLink.displayName = 'ButtonLink';
