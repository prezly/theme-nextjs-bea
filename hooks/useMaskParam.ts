'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function useMaskParam(): boolean {
    const searchParams = useSearchParams();
    const mask = searchParams.get('mask');

    return useMemo(() => {
        if (!mask) {
            return false;
        }

        try {
            return Boolean(JSON.parse(mask));
        } catch {
            return false;
        }
    }, [mask]);
}
