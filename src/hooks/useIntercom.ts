'use client';

import { useCallback, useRef } from 'react';

interface IntercomConfig {
    app_id: string;
    region?: 'us' | 'eu' | 'ap';
    user_id?: string;
    name?: string;
    email?: string;
    created_at?: number;
}

export function useIntercom() {
    const isLoadedRef = useRef(false);
    const isLoadingRef = useRef(false);

    const loadIntercom = useCallback(async (config: IntercomConfig) => {
        // Prevent multiple loads
        if (isLoadedRef.current || isLoadingRef.current) {
            // If already loaded, just show the messenger
            if (isLoadedRef.current && window.Intercom) {
                window.Intercom('show');
            }
            return;
        }

        isLoadingRef.current = true;

        try {
            // Dynamically import and initialize Intercom
            const { default: Intercom } = await import('@intercom/messenger-js-sdk');

            // Initialize Intercom with config
            Intercom(config);

            isLoadedRef.current = true;
            isLoadingRef.current = false;

            // Show the messenger immediately after loading
            if (window.Intercom) {
                window.Intercom('show');
            }
        } catch (error) {
            console.error('Failed to load Intercom:', error);
            isLoadingRef.current = false;
        }
    }, []);

    const showIntercom = useCallback(() => {
        if (isLoadedRef.current && window.Intercom) {
            window.Intercom('show');
        }
    }, []);

    const hideIntercom = useCallback(() => {
        if (isLoadedRef.current && window.Intercom) {
            window.Intercom('hide');
        }
    }, []);

    return {
        loadIntercom,
        showIntercom,
        hideIntercom,
        isLoaded: isLoadedRef.current,
    };
}
