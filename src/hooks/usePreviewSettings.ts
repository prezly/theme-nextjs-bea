'use client';

import { useEffect, useState } from 'react';

import { decodePreviewHash } from '@/utils';

const isPreviewMode = process.env.PREZLY_MODE === 'preview';
const HASH_SETTINGS_KEY = 'previewHashSettings';

/**
 * Returns the latest preview settings received via postMessage from the parent frame,
 * or decoded from the URL hash (standalone preview links).
 * Settings are persisted to sessionStorage so they survive client-side navigation.
 * Returns `null` until settings are available, allowing callers to distinguish
 * "no settings yet" (fall back to props) from "settings received" (use as authoritative source).
 */
export function usePreviewSettings(): Record<string, string> | null {
    const [settings, setSettings] = useState<Record<string, string> | null>(null);

    // Seed from URL hash or sessionStorage (standalone preview links)
    useEffect(() => {
        if (!isPreviewMode) return;
        const hashSettings = decodePreviewHash(window.location.hash);
        if (hashSettings) {
            setSettings(hashSettings);
            try {
                sessionStorage.setItem(HASH_SETTINGS_KEY, JSON.stringify(hashSettings));
            } catch {}
        } else {
            try {
                const stored = sessionStorage.getItem(HASH_SETTINGS_KEY);
                if (stored) setSettings(JSON.parse(stored));
            } catch {}
        }
    }, []);

    // Listen for postMessage updates (iframe context — overrides hash)
    useEffect(() => {
        if (!isPreviewMode) return;

        function handleMessage(event: MessageEvent) {
            if (event.data?.type === 'settingsUpdate') {
                setSettings(event.data.settings);
            }
        }
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return isPreviewMode ? settings : null;
}
