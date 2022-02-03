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

    function accept() {
        return setConsent(true);
    }
    function reject() {
        return setConsent(false);
    }
    function toggle() {
        return setConsent(!consent);
    }

    return {
        accept,
        isTrackingAllowed,
        reject,
        supportsCookie: navigator.cookieEnabled,
        toggle,
    };
}
