'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCookieConsent } from '../../CookieConsentContext';
import { ConsentCategory } from '../../types';

import { ONETRUST_INTEGRATION_EVENT, ONETRUST_NECESSARY_COOKIES_CATEGORY } from './constants';
import { getOnetrustCookieConsentStatus } from './getOnetrustCookieConsentStatus';

interface Props {
    category?: string;
}

/*
 * @see https://my.onetrust.com/s/article/UUID-69162cb7-c4a2-ac70-39a1-ca69c9340046?language=en_US#UUID-69162cb7-c4a2-ac70-39a1-ca69c9340046_section-idm46212287146848
 */
export function OneTrustManager({ category }: Props) {
    const path = usePathname();
    const [oneTrust, setOneTrust] = useState<typeof window.OneTrust | null>(null);
    const { registerUpdatePreferencesCallback, setConsent } = useCookieConsent();

    useEffect(() => {
        if (!oneTrust) {
            return noop;
        }

        document.getElementById('onetrust-consent-sdk')?.remove();

        oneTrust.Init();

        setTimeout(() => {
            oneTrust.LoadBanner();
            oneTrust.ToggleInfoDisplay();
        }, 1000);
    }, [oneTrust, path]);

    useEffect(() => {
        if (!category || !oneTrust) {
            return noop;
        }

        function handleConsentChange() {
            const categories: ConsentCategory[] = [];

            if (getOnetrustCookieConsentStatus(ONETRUST_NECESSARY_COOKIES_CATEGORY)) {
                categories.push(ConsentCategory.NECESSARY);
            }

            if (getOnetrustCookieConsentStatus(category!)) {
                categories.push(
                    ConsentCategory.FIRST_PARTY_ANALYTICS,
                    ConsentCategory.THIRD_PARTY_COOKIES,
                );
            }

            setConsent({ categories });
        }

        oneTrust.OnConsentChanged(handleConsentChange);
    }, [oneTrust, category, setConsent]);

    useEffect(() => {
        if (window.OneTrust) {
            setOneTrust(window.OneTrust);
            return;
        }

        function onOneTrustLoaded() {
            setOneTrust(window.OneTrust);
            document.body.removeEventListener(ONETRUST_INTEGRATION_EVENT, onOneTrustLoaded);
        }

        document.body.addEventListener(ONETRUST_INTEGRATION_EVENT, onOneTrustLoaded);

        return () => {
            document.body.removeEventListener(ONETRUST_INTEGRATION_EVENT, onOneTrustLoaded);
        };
    }, []);

    useEffect(() => {
        registerUpdatePreferencesCallback(() => {
            window.OneTrust?.ToggleInfoDisplay();
        });
    }, [registerUpdatePreferencesCallback]);

    return null;
}

function noop() {
    return undefined;
}
