import type { Newsroom } from '@prezly/sdk';
import { getDataRequestLink } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';

interface Props {
    newsroom: Newsroom;
    localeCode: Locale.Code;
    className?: string;
    children: ReactNode;
}

export function DataRequestLink({ newsroom, localeCode, className, children }: Props) {
    const href = getDataRequestLink(newsroom, localeCode);

    return (
        <a href={href} className={className}>
            {children}
        </a>
    );
}
