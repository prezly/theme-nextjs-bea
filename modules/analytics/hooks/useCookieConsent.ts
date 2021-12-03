import { useAnalyticsContext } from '../context';

interface State {
    accept: () => void;
    isTrackingAllowed: boolean | null;
    reject: () => void;
    supportsCookie: boolean;
    toggle: () => void;
}

export function useCookieConsent(): State {
    const { consent, isTrackingAllowed, setConsent } = useAnalyticsContext();

    const accept = () => setConsent(true);
    const reject = () => setConsent(false);
    const toggle = () => setConsent(!consent);

    return {
        accept,
        isTrackingAllowed,
        reject,
        supportsCookie: navigator.cookieEnabled,
        toggle,
    };
}
