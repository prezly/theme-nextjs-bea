import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useCookieConsent } from '../../CookieConsentContext';
import { ConsentCategory } from '../../types';

import { getOnetrustCookieConsentStatus } from './getOnetrustCookieConsentStatus';

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
    }
}

interface Props {
    script: string;
    category?: string;
}

export function OneTrustCookie({ script, category }: Props) {
    const path = usePathname();
    const { setConsent } = useCookieConsent();

    /*
     * @see https://my.onetrust.com/s/article/UUID-69162cb7-c4a2-ac70-39a1-ca69c9340046?language=en_US#UUID-69162cb7-c4a2-ac70-39a1-ca69c9340046_section-idm46212287146848
     */
    useEffect(() => {
        document.getElementById('onetrust-consent-sdk')?.remove();

        if (window.OneTrust) {
            window.OneTrust.Init();

            setTimeout(() => {
                window.OneTrust?.LoadBanner();
            }, 1000);
        }
    }, [path]);

    useEffect(() => {
        if (!category) {
            return noop;
        }

        function handleEvent() {
            const hasConsent = getOnetrustCookieConsentStatus(category!);

            setConsent({
                categories: hasConsent
                    ? [
                          ConsentCategory.NECESSARY,
                          ConsentCategory.FIRST_PARTY_ANALYTICS,
                          ConsentCategory.THIRD_PARTY_COOKIES,
                      ]
                    : [],
            });
        }

        document.body.addEventListener(ONETRUST_INTEGRATION_EVENT, handleEvent);

        return () => {
            document.body.removeEventListener(ONETRUST_INTEGRATION_EVENT, handleEvent);
        };
    }, [category, setConsent]);

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
                    </script>`,
            }}
        />
    );
}

function noop() {
    return undefined;
}
