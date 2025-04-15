'use client';

import { useEffect } from 'react';

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
    const { registerUpdatePreferencesCallback, setConsent } = useCookieConsent();

    useEffect(() => {
        function handleConsentChange() {
            console.log('consent changed?');
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

        function onOneTrustLoaded() {
            const oneTrust: Window['OneTrust'] = window.OneTrust;

            if (!oneTrust) {
                return;
            }

            oneTrust.OnConsentChanged(handleConsentChange);
            oneTrust.Init();
            oneTrust.LoadBanner();

            registerUpdatePreferencesCallback(oneTrust.ToggleInfoDisplay);

            document.body.removeEventListener(ONETRUST_INTEGRATION_EVENT, onOneTrustLoaded);
        }

        if (window.OneTrust) {
            onOneTrustLoaded();
            return undefined;
        }

        document.body.addEventListener(ONETRUST_INTEGRATION_EVENT, onOneTrustLoaded);

        return () => {
            document.body.removeEventListener(ONETRUST_INTEGRATION_EVENT, onOneTrustLoaded);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}
