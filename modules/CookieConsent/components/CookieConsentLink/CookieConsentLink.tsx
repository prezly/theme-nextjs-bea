'use client';

import { Newsroom } from '@prezly/sdk';
import { useEffect, useState } from 'react';

import { useCookieConsent } from '../../CookieConsentContext';

interface Props {
    className?: string;
    trackingPolicy?: Newsroom['tracking_policy'];
    startUsingCookiesLabel?: string;
    stopUsingCookiesLabel?: string;
}

export function CookieConsentLink({
    className,
    startUsingCookiesLabel = 'Start using cookies',
    stopUsingCookiesLabel = 'Stop using cookies',
}: Props) {
    const [mounted, setMounted] = useState(false);
    const { consent, isNavigatorSupportsCookies, trackingPolicy, updatePreferences } =
        useCookieConsent();

    useEffect(() => setMounted(true), []);

    if (
        !mounted ||
        !isNavigatorSupportsCookies ||
        trackingPolicy === Newsroom.TrackingPolicy.LENIENT
    ) {
        return null;
    }

    const isConsentGiven = consent && consent.categories.length > 1;

    return (
        <button type="button" className={className} onClick={updatePreferences}>
            {isConsentGiven ? stopUsingCookiesLabel : startUsingCookiesLabel}
        </button>
    );
}
