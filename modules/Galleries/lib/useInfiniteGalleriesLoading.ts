import type { NewsroomGallery } from '@prezly/sdk';

import { useInfiniteLoading } from '@/hooks';
import type { PaginationProps } from 'types';

async function fetchGalleries(
    page: number,
    pageSize: number,
): Promise<{ galleries: NewsroomGallery[] }> {
    const result = await fetch('/api/fetch-galleries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page,
            pageSize,
        }),
    });

    if (!result.ok) {
        const { message } = await result.json();
        throw new Error(message);
    }

    return result.json();
}

export function useInfiniteGalleriesLoading(
    initialGalleries: NewsroomGallery[],
    pagination: PaginationProps,
) {
    const { canLoadMore, data, isLoading, loadMore } = useInfiniteLoading<NewsroomGallery>({
        fetchingFn: async (nextPage, pageSize) => {
            const { galleries } = await fetchGalleries(nextPage, pageSize);
            return galleries;
        },
        initialData: initialGalleries,
        pagination,
    });

    return {
        canLoadMore,
        galleries: data,
        isLoading,
        loadMoreGalleries: loadMore,
    };
}
