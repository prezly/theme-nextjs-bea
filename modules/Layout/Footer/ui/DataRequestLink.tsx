import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { PrivacyPortal } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

interface Props {
    newsroom: Newsroom;
    localeCode: Locale.Code;
    className?: string;
    children: ReactNode;
}

export function DataRequestLink({ newsroom, localeCode, className, children }: Props) {
    const href = PrivacyPortal.getDataRequestUrl(newsroom, localeCode);

    return (
        <a href={href} className={className}>
            {children}
        </a>
    );
}
