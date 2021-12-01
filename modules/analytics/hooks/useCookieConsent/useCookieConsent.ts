import { useAnalyticsContext } from '../../context';

import { isPrezlyTrackingAllowed } from './lib';

interface State {
    accept: () => void;
    isTrackingAllowed: boolean | null;
    reject: () => void;
    supportsCookie: boolean;
    toggle: () => void;
}

export function useCookieConsent(): State {
    const { consent, setConsent } = useAnalyticsContext();

    const accept = () => setConsent(true);
    const reject = () => setConsent(false);
    const toggle = () => setConsent(!consent);

    return {
        accept,
        isTrackingAllowed: isPrezlyTrackingAllowed(consent),
        reject,
        supportsCookie: navigator.cookieEnabled,
        toggle,
    };
}
