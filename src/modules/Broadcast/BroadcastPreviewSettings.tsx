'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { decodePreviewHash } from '@/utils';

interface PreviewSettingsContextValue {
    settings: Record<string, string> | null;
}

const context = createContext<PreviewSettingsContextValue>({ settings: null });

export function BroadcastPreviewSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Record<string, string> | null>(null);

    // Seed from URL hash or sessionStorage
    useEffect(() => {
        const hashSettings = decodePreviewHash(window.location.hash);
        if (hashSettings) {
            setSettings(hashSettings);
            // sessionStorage is scoped to the browser tab and clears automatically when the tab closes.
            try {
                sessionStorage.setItem('previewSettings', JSON.stringify(hashSettings));
            } catch {}
        } else {
            try {
                const stored = sessionStorage.getItem('previewSettings');
                if (stored) setSettings(JSON.parse(stored));
            } catch {}
        }
    }, []);

    // Single postMessage listener for all preview settings consumers
    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (event.data?.type === 'settingsUpdate') {
                setSettings(event.data.settings);
                try {
                    sessionStorage.setItem('previewSettings', JSON.stringify(event.data.settings));
                } catch {}
            }
        }
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return <context.Provider value={{ settings }}>{children}</context.Provider>;
}

export function usePreviewSettingsContext() {
    return useContext(context);
}
