'use client';

import { Newsroom } from '@prezly/sdk';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useRef, useState } from 'react';

import type { Consent } from './types';

interface Context {
    consent: Consent | null;
    trackingPolicy: Newsroom['tracking_policy'];
    setConsent: Dispatch<SetStateAction<Consent | null>>;
    updatePreferences: () => void;
    isNavigatorSupportsCookies: boolean;
    registerUpdatePreferencesCallback: (callback: () => undefined) => void;
}

export const context = createContext<Context>({
    consent: null,
    setConsent: () => undefined,
    trackingPolicy: Newsroom.TrackingPolicy.DEFAULT,
    updatePreferences: () => undefined,
    isNavigatorSupportsCookies: true,
    registerUpdatePreferencesCallback: () => undefined,
});

interface Props {
    children: ReactNode;
    trackingPolicy: Newsroom['tracking_policy'];
}

export function CookieConsentProvider({ children, trackingPolicy }: Props) {
    const [consent, setConsent] = useState<Consent | null>(null);
    const updatePreferencesCallbackRef = useRef<null | (() => void)>(null);
    const isNavigatorSupportsCookies = typeof navigator !== 'undefined' && navigator.cookieEnabled;

    const updatePreferences = () => {
        updatePreferencesCallbackRef.current?.();
    };

    function registerUpdatePreferencesCallback(callback: () => void) {
        updatePreferencesCallbackRef.current = callback;
    }

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
