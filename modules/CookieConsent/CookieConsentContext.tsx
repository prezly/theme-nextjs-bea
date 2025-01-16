import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

import type { Consent } from './types';

interface Context {
    consent: Consent | null;
    setConsent: (consent: Consent | null) => void;
}

const CookieConsentContext = createContext<Context>({
    consent: null,
    setConsent: () => undefined,
});

interface Props {
    children: ReactNode;
}

export function CookieConsentContextProvider({ children }: Props) {
    const [consent, setConsent] = useState<Consent | null>(null);

    return (
        <CookieConsentContext.Provider value={{ consent, setConsent }}>
            {children}
        </CookieConsentContext.Provider>
    );
}

export function useCookieConsent() {
    return useContext(CookieConsentContext);
}
