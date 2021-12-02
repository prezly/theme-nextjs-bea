import Link, { LinkProps } from 'next/link';
import React, { FunctionComponent, PropsWithChildren } from 'react';

import { toUrlSlug } from '@/utils/locale';

type Props = PropsWithChildren<LinkProps> & {
    className?: string;
    forceRefresh?: boolean;
};

// Implementation taken from https://headlessui.dev/react/menu#integrating-with-next-js
const DropdownLink: FunctionComponent<Props> = (props) => {
    const { href, locale, children, forceRefresh, ...rest } = props;

    if (forceRefresh) {
        let stringHref = href.toString();
        if (!stringHref.startsWith('/')) {
            stringHref = `/${stringHref}`;
        }

        const localeUrl = locale && toUrlSlug(locale);
        const hrefWithLocale = localeUrl ? `/${localeUrl}${stringHref}` : stringHref;

        return (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <a href={hrefWithLocale} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <Link href={href} locale={locale}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <a {...rest}>{children}</a>
        </Link>
    );
};

export default DropdownLink;
