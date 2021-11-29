import { useNewsroomContext } from '@/contexts/newsroom';

import { isPrezlyTrackingAllowed } from './lib';

interface State {
    accept: () => void;
    isTrackingAllowed: boolean | null;
    reject: () => void;
    supportsCookie: boolean;
    toggle: () => void;
}

export function useCookieConsent(): State {
    const { consent, setConsent } = useNewsroomContext();

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
