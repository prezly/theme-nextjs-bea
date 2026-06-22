'use client';

import { useEffect, useRef } from 'react';

import { useCookieConsent } from '../../CookieConsentContext';
import { ConsentCategory } from '../../types';

import { ONETRUST_INTEGRATION_EVENT, ONETRUST_NECESSARY_COOKIES_CATEGORY } from './constants';
import { getOnetrustCookieConsentStatus } from './getOnetrustCookieConsentStatus';

interface Props {
    category?: string;
    isPreview: boolean;
}

/*
 * @see https://my.onetrust.com/s/article/UUID-69162cb7-c4a2-ac70-39a1-ca69c9340046?language=en_US#UUID-69162cb7-c4a2-ac70-39a1-ca69c9340046_section-idm46212287146848
 */
export function OneTrustManager({ category, isPreview }: Props) {
    const { registerUpdatePreferencesCallback, setConsent } = useCookieConsent();
    const isOneTrustLoaded = useRef(false);

    useEffect(() => {
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

        function onOneTrustLoaded() {
            const oneTrust: Window['OneTrust'] = window.OneTrust;

            if (!oneTrust) {
                return;
            }

            // OneTrust may call OptanonWrapper more than once while it is loading.
            // We only need to connect our callbacks once because running this block again
            // can make the banner render again and duplicate OneTrust events in GTM.
            if (isOneTrustLoaded.current) {
                return;
            }

            isOneTrustLoaded.current = true;
            document.body.removeEventListener(ONETRUST_INTEGRATION_EVENT, onOneTrustLoaded);

            if (isPreview) {
                oneTrust.AllowAll();
                setConsent({
                    categories: [
                        ConsentCategory.NECESSARY,
                        ConsentCategory.FIRST_PARTY_ANALYTICS,
                        ConsentCategory.THIRD_PARTY_COOKIES,
                    ],
                });
                return;
            }

            oneTrust.OnConsentChanged(handleConsentChange);
            handleConsentChange();

            registerUpdatePreferencesCallback(() => oneTrust.ToggleInfoDisplay());
        }

        if (window.OneTrust) {
            onOneTrustLoaded();
            return undefined;
        }

        document.body.addEventListener(ONETRUST_INTEGRATION_EVENT, onOneTrustLoaded);

        return () => {
            document.body.removeEventListener(ONETRUST_INTEGRATION_EVENT, onOneTrustLoaded);
        };
    }, [category, isPreview, registerUpdatePreferencesCallback, setConsent]);

    return null;
}
