'use client';

import { useCallback } from 'react';

export function useStoryCardLayout(isFlatList: boolean) {
    const getStoryCardSize = useCallback(
        (index: number): 'small' | 'medium' | 'big' => {
            if (isFlatList) {
                return 'medium';
            }

            if (index < 2) {
                return 'big';
            }

            return 'medium';
        },
        [isFlatList],
    );

    return getStoryCardSize;
}
