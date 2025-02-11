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
    return (
        <>
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
            <OneTrustManager category={category} />
        </>
    );
}
