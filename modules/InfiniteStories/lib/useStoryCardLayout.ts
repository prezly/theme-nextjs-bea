import { useCallback } from 'react';

export function useStoryCardLayout(isFlatList: boolean, notHighlightedStoriesLength: number) {
    const getStoryCardSize = useCallback(
        (index: number): 'small' | 'medium' | 'big' => {
            if (isFlatList) {
                return 'small';
            }

            if (notHighlightedStoriesLength === 3 || notHighlightedStoriesLength === 6) {
                return 'medium';
            }

            if (index < 2 || notHighlightedStoriesLength === 4) {
                return 'big';
            }

            if (index < 5) {
                return 'medium';
            }

            return 'small';
        },
        [isFlatList, notHighlightedStoriesLength],
    );

    return getStoryCardSize;
}
