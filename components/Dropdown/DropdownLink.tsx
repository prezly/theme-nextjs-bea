import Link, { LinkProps } from 'next/link';
import React, { FunctionComponent, PropsWithChildren } from 'react';

import { useGetLinkLocale } from '@/hooks';
import { fromSlug } from '@/utils/locale';

type Props = PropsWithChildren<LinkProps> & {
    className?: string;
    forceRefresh?: boolean;
};

// Implementation taken from https://headlessui.dev/react/menu#integrating-with-next-js
const DropdownLink: FunctionComponent<Props> = (props) => {
    const { href, locale, children, forceRefresh, ...rest } = props;
    const getLinkLocale = useGetLinkLocale();

    const localeUrl = getLinkLocale(locale ? fromSlug(locale) : undefined);

    if (forceRefresh) {
        let stringHref = href.toString();
        if (!stringHref.startsWith('/')) {
            stringHref = `/${stringHref}`;
        }

        const hrefWithLocale = localeUrl ? `/${localeUrl}${stringHref}` : stringHref;

        return (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <a href={hrefWithLocale} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <Link href={href} locale={localeUrl}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <a {...rest}>{children}</a>
        </Link>
    );
};

export default DropdownLink;
