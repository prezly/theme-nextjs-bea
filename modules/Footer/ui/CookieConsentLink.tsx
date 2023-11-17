'use client';

import { CookieConsentLink as BaseConsentLink } from '@prezly/analytics-nextjs';

interface Props {
    className?: string;
    startUsingCookiesLabel: string;
    stopUsingCookiesLabel: string;
}

export function CookieConsentLink({
    className,
    startUsingCookiesLabel,
    stopUsingCookiesLabel,
}: Props) {
    return (
        <BaseConsentLink
            className={className}
            startUsingCookiesLabel={startUsingCookiesLabel}
            stopUsingCookiesLabel={stopUsingCookiesLabel}
        />
    );
}
