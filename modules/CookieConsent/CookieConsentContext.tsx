'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

import type { Consent } from './types';

interface Context {
    consent: Consent | null;
    setConsent: Dispatch<SetStateAction<Consent | null>>;
}

export const context = createContext<Context>({
    consent: null,
    setConsent: () => undefined,
});

interface Props {
    children: ReactNode;
}

export function CookieConsentProvider({ children }: Props) {
    const [consent, setConsent] = useState<Consent | null>(null);

    return <context.Provider value={{ consent, setConsent }}>{children}</context.Provider>;
}

export function useCookieConsent() {
    return useContext(context);
}
