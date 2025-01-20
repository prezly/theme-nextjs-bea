'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCookieConsent } from '../../CookieConsentContext';
import { ConsentCategory } from '../../types';

import { getOnetrustCookieConsentStatus } from './getOnetrustCookieConsentStatus';

const ONETRUST_NECESSARY_COOKIES_CATEGORY = 'C0001';
const ONETRUST_INTEGRATION_EVENT = 'OnetrustConsentModalCallback';

declare global {
    interface Window {
        OnetrustActiveGroups?: string;
        OneTrust?: {
            Init(): void;
            ToggleInfoDisplay(): void;
            LoadBanner(): void;
            Close(): void;
            AllowAll(): void;
            RejectAll(): void;
        };
        Optanon?: {
            OnConsentChanged(event: any): void;
        };
    }
}

interface Props {
    script: string;
    category?: string;
}

export function OneTrustCookie({ script, category }: Props) {
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

    return (
        <div
            id="onetrust-cookie-consent-integration"
            dangerouslySetInnerHTML={{
                __html: `
                    ${script}
                    <script>
                        window.OptanonWrapper = (function () {
                            const prev = window.OptanonWrapper || function() {};
                            return function() {
                                prev();
                                document.body.dispatchEvent(new Event("${ONETRUST_INTEGRATION_EVENT}")); // allow listening to the OptanonWrapper callback from anywhere.
                            };
                        })();
                    </script>
                `,
            }}
        />
    );
}

function noop() {
    return undefined;
}
