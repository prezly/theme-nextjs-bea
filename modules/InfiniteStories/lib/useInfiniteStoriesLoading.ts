import type { Category } from '@prezly/sdk';
import { useEffect } from 'react';

import { useCurrentLocale, useInfiniteLoading } from '@/hooks';
import { LocaleObject } from '@/utils';
import { PaginationProps, StoryWithImage } from 'types';

async function fetchStories(
    page: number,
    pageSize: number,
    category?: Category,
    locale?: LocaleObject,
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
            include: ['thumbnail_image'],
            ...(locale && {
                localeCode: locale.toUnderscoreCode(),
            }),
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

    const { canLoadMore, data, isLoading, loadMore, resetData } =
        useInfiniteLoading<StoryWithImage>({
            fetchingFn: async (nextPage: number) => {
                const { stories } = await fetchStories(
                    nextPage,
                    pagination.pageSize,
                    category,
                    currentLocale,
                );
                return stories;
            },
            initialData: initialStories,
            pagination,
        });

    useEffect(() => {
        if (category?.id) {
            resetData();
        }
    }, [category?.id, resetData]);

    return {
        canLoadMore,
        isLoading,
        loadMoreStories: loadMore,
        stories: data,
    };
};
