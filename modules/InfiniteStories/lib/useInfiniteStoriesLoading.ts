import { Category } from '@prezly/sdk';

import { useCurrentLocale, useInfiniteLoading } from '@/hooks';
import { PaginationProps, StoryWithImage } from 'types';

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
    const currentLocale = useCurrentLocale();
    const { canLoadMore, currentPage, data, isLoading, loadMore } =
        useInfiniteLoading<StoryWithImage>({
            fetchingFn: async () => {
                const { stories } = await fetchStories(
                    currentPage + 1,
                    pagination.pageSize,
                    category,
                    currentLocale,
                );
                return stories;
            },
            initialData: initialStories,
            pagination,
        });

    return {
        canLoadMore,
        isLoading,
        loadMoreStories: loadMore,
        stories: data,
    };
};
