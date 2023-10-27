'use client';

/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-use-before-define */
import type { Locale } from '@prezly/theme-kit-intl';
import Link from 'next/link';
import type { ComponentProps } from 'react';

import { useLocaleSlug } from './useLocaleSlug';

type Props = ComponentProps<typeof Link> & {
    locale?: Locale.AnyCode;
};

export function IntlLink({ locale, href, ...rest }: Props) {
    const slug = useLocaleSlug(locale);

    const prefixedHref = slug ? prefixHref(`/${slug}`, href) : href;

    return <Link {...rest} href={prefixedHref ?? href} />;
}

function prefixHref(prefix: `/${string}`, href: Props['href']): Props['href'] {
    if (typeof href === 'string' && href.startsWith('/')) {
        return `${prefix}${href}`;
    }
    if (typeof href === 'object' && href.pathname?.startsWith('/')) {
        return {
            ...href,
            pathname: `${prefix}${href.pathname}`,
        };
    }

    return href;
}
