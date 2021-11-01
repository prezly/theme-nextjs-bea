import { Category } from '@prezly/sdk/dist/types';
import { useCallback, useState } from 'react';

import { StoryWithImage } from '@/modules/Stories/lib/types';
import { PaginationProps } from 'types';

import { useCurrentLocale } from './useCurrentLocale';

async function fetchStories(
    page: number,
    pageSize: number,
    category?: Category,
    locale?: string,
): Promise<{ stories: StoryWithImage[] }> {
    const result = await fetch('/api/fetch-stories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page,
            pageSize,
            category,
            include: ['header_image'],
            locale,
        }),
    });

    if (!result.ok) {
        const { message } = await result.json();
        throw new Error(message);
    }

    return result.json();
}

export const useInfiniteStoriesLoading = (
    initialStories: StoryWithImage[],
    pagination: PaginationProps,
    category?: Category,
) => {
    const [displayedStories, setDisplayedStories] = useState<StoryWithImage[]>(initialStories);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const currentLocale = useCurrentLocale();

    const { itemsTotal, pageSize } = pagination;
    const totalPages = Math.ceil(itemsTotal / pageSize);

    const canLoadMore = currentPage < totalPages;

    const loadMoreStories = useCallback(async () => {
        if (!canLoadMore) {
            return;
        }

        try {
            setIsLoading(true);

            const { stories: newStories } = await fetchStories(
                currentPage + 1,
                pageSize,
                category,
                currentLocale,
            );
            setDisplayedStories((stories) => stories.concat(newStories));
            setCurrentPage((page) => page + 1);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [canLoadMore, currentPage, pageSize, category, currentLocale]);

    return {
        canLoadMore,
        displayedStories,
        isLoading,
        loadMoreStories,
    };
};
