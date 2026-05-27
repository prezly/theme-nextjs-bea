'use client';

import { usePreviewSettingsContext } from '@/modules/Broadcast';

const isPreviewMode = process.env.PREZLY_MODE === 'preview';

/**
 * Returns the latest preview settings received via postMessage from the parent frame,
 * or decoded from the URL hash (standalone preview links).
 * Settings are persisted to sessionStorage so they survive client-side navigation.
 * Returns `null` until settings are available, allowing callers to distinguish
 * "no settings yet" (fall back to props) from "settings received" (use as authoritative source).
 */
export function usePreviewSettings(): Record<string, string> | null {
    const { settings } = usePreviewSettingsContext();
    return isPreviewMode ? settings : null;
}
