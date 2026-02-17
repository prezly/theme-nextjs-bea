'use client';

import { useEffect, useState } from 'react';

const isPreviewMode = process.env.PREZLY_MODE === 'preview';

/**
 * Returns the latest preview settings received via postMessage from the parent frame.
 * Returns `null` until the first message is received, allowing callers to distinguish
 * "no settings yet" (fall back to props) from "settings received" (use as authoritative source).
 */
export function usePreviewSettings(): Record<string, string> | null {
    const [settings, setSettings] = useState<Record<string, string> | null>(null);

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
