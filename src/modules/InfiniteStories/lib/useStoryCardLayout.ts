'use client';

import { useCallback } from 'react';

export function useStoryCardLayout(_isFlatList: boolean) {
    const getStoryCardSize = useCallback((_index: number): 'small' | 'medium' | 'big' => {
        // Neumann renders a uniform 3-column grid of equally-sized cards
        // (no "big" hero-style first cards), regardless of list type.
        return 'medium';
    }, []);

    return getStoryCardSize;
}
