'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCookieConsent } from '../../CookieConsentContext';
import { ConsentCategory } from '../../types';

import { ONETRUST_INTEGRATION_EVENT } from './constants';
import { getOnetrustCookieConsentStatus } from './getOnetrustCookieConsentStatus';

interface Props {
    category?: string;
}

const ONETRUST_NECESSARY_COOKIES_CATEGORY = 'C0001';

export function OneTrustManager({ category }: Props) {
    const path = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const { registerUpdatePreferencesCallback, setConsent } = useCookieConsent();

    useEffect(() => setIsMounted(true), []);

    /*
     * @see https://my.onetrust.com/s/article/UUID-69162cb7-c4a2-ac70-39a1-ca69c9340046?language=en_US#UUID-69162cb7-c4a2-ac70-39a1-ca69c9340046_section-idm46212287146848
     */
    useEffect(() => {
        document.getElementById('onetrust-consent-sdk')?.remove();

        window.OneTrust?.Init();

        setTimeout(() => {
            window.OneTrust?.LoadBanner();
            window.OneTrust?.ToggleInfoDisplay();
        }, 1000);
    }, [path]);

    useEffect(() => {
        if (!category) {
            return noop;
        }

        function handleEvent() {
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

        window.Optanon?.OnConsentChanged(handleEvent);
        document.body.addEventListener(ONETRUST_INTEGRATION_EVENT, handleEvent);

        return () => {
            document.body.removeEventListener(ONETRUST_INTEGRATION_EVENT, handleEvent);
        };
    }, [category, setConsent]);

    useEffect(() => {
        registerUpdatePreferencesCallback(() => {
            window.OneTrust?.ToggleInfoDisplay();
        });
    }, [registerUpdatePreferencesCallback]);

    if (!isMounted) {
        return null;
    }
}

function noop() {
    return undefined;
}
