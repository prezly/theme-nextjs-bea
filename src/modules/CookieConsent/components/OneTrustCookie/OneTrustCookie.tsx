'use client';

import { useEffect } from 'react';

import { isPreviewActive } from '@/utils';

import { ONETRUST_INTEGRATION_EVENT } from './constants';
import { OneTrustManager } from './OneTrustManager';

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
            OnConsentChanged(event: any): void;
        };
    }
}

interface Props {
    script: string;
    category?: string;
}

export function OneTrustCookie({ script, category }: Props) {
    const isPreview = isPreviewActive();

    useEffect(() => {
        if (isPreview && window.OneTrust) {
            window.OneTrust.AllowAll();
        }
    }, [isPreview]);

    return (
        <>
            {/** biome-ignore lint/correctness/useUniqueElementIds: <Rendered once at the root, it's ok to have hard-coded id> */}
            <div
                id="onetrust-cookie-consent-integration"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <...>
                dangerouslySetInnerHTML={{
                    __html: `
                    ${script}
                    <script>
                        // This is executed after OneTrust is loaded
                        // See https://my.onetrust.com/s/article/UUID-29158b4e-22f6-0067-aa36-94f3b8cf3561
                        window.OptanonWrapper = (function() {
                            const previousOptanonWrapper = window.OptanonWrapper || function() {};

                            return function() {
                                previousOptanonWrapper();
                                document.body.dispatchEvent(new Event("${ONETRUST_INTEGRATION_EVENT}"));
                            }
                        })();
                    </script>`,
                }}
            />
            <OneTrustManager category={category} />
        </>
    );
}
