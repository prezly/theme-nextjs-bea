'use client';

import { useSyncExternalStore } from 'react';

import { isPreviewActive } from '@/utils';

function subscribe() {
    return () => {};
}

function getServerSnapshot() {
    return false;
}

/**
 * Hydration-safe `isPreviewActive()` for use during render.
 * The server can't see the preview query param or cookie, so it always renders
 * the non-preview markup. React hydrates with that same server snapshot, then
 * re-renders with the real value, instead of failing hydration (React #418).
 */
export function useIsPreviewActive(): boolean {
    return useSyncExternalStore(subscribe, isPreviewActive, getServerSnapshot);
}
