'use client';

import { Newsroom } from '@prezly/sdk';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

import type { Consent } from './types';

interface Context {
    consent: Consent | undefined;
    trackingPolicy: Newsroom['tracking_policy'];
    setConsent: Dispatch<SetStateAction<Consent | undefined>>;
    updatePreferences: () => void;
    isNavigatorSupportsCookies: boolean;
    registerUpdatePreferencesCallback: (callback: () => void) => void;
}

export const context = createContext<Context>({
    consent: undefined,
    setConsent: () => undefined,
    trackingPolicy: Newsroom.TrackingPolicy.LENIENT,
    updatePreferences: () => undefined,
    isNavigatorSupportsCookies: true,
    registerUpdatePreferencesCallback: () => undefined,
});

interface Props {
    children: ReactNode;
    trackingPolicy: Newsroom['tracking_policy'];
}

export function CookieConsentProvider({ children, trackingPolicy }: Props) {
    const [consent, setConsent] = useState<Consent | undefined>(undefined);
    const updatePreferencesCallbackRef = useRef<null | (() => void)>(null);
    const isNavigatorSupportsCookies = typeof navigator !== 'undefined' && navigator.cookieEnabled;

    const updatePreferences = useCallback(() => {
        updatePreferencesCallbackRef.current?.();
    }, []);

    const registerUpdatePreferencesCallback = useCallback((callback: () => void) => {
        updatePreferencesCallbackRef.current = callback;
    }, []);

    return (
        <context.Provider
            value={{
                consent,
                isNavigatorSupportsCookies,
                trackingPolicy,
                setConsent,
                updatePreferences,
                registerUpdatePreferencesCallback,
            }}
        >
            {children}
        </context.Provider>
    );
}

export function useCookieConsent() {
    return useContext(context);
}
