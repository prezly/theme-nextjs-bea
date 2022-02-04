import { useCallback, useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';

import type { PaginationProps } from 'types';

interface Parameters<T> {
    fetchingFn: (nextPage: number) => Promise<T[]>;
    initialData: T[];
    pagination: PaginationProps;
}

interface State<T> {
    canLoadMore: boolean;
    currentPage: number;
    data: T[];
    isLoading: boolean;
    loadMore: () => void;
    resetData: () => void;
}

export function useInfiniteLoading<T>({
    fetchingFn,
    initialData,
    pagination,
}: Parameters<T>): State<T> {
    const [data, setData] = useState<T[]>(initialData);
    const [currentPage, setCurrentPage] = useState(pagination.currentPage);

    const { itemsTotal, pageSize } = pagination;
    const pagesTotal = Math.ceil(itemsTotal / pageSize);
    const canLoadMore = currentPage < pagesTotal;

    const [{ error, loading: isLoading, value }, loadMoreFn] = useAsyncFn(async () => {
        const nextPage = currentPage + 1;
        const newData = await fetchingFn(nextPage);
        setCurrentPage(nextPage);

        return newData;
    }, [currentPage, fetchingFn, setCurrentPage]);

    const loadMore = useCallback(() => {
        if (canLoadMore) {
            loadMoreFn();
        }
    }, [canLoadMore, loadMoreFn]);

    const resetData = useCallback(() => {
        setData(initialData);
        setCurrentPage(pagination.currentPage);
    }, [pagination.currentPage, initialData]);

    useEffect(() => {
        if (value) {
            setData((currentData) => [...currentData, ...value]);
        }
    }, [value]);

    useEffect(() => {
        if (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }, [error]);

    return {
        canLoadMore,
        currentPage,
        data,
        isLoading,
        loadMore,
        resetData,
    };
}
