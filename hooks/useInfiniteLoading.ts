import { useCallback, useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';

import { PaginationProps } from 'types';

interface Parameters<T> {
    fetchingFn: () => Promise<T[]>;
    initialData: T[];
    pagination: PaginationProps;
}

interface State<T> {
    canLoadMore: boolean;
    currentPage: number;
    data: T[];
    isLoading: boolean;
    loadMore: () => void;
}

export function useInfiniteLoading<T>({
    fetchingFn,
    initialData,
    pagination,
}: Parameters<T>): State<T> {
    const [data, setData] = useState<T[]>(initialData);
    const [currentPage, setCurrentPage] = useState(1);

    const { itemsTotal, pageSize } = pagination;
    const pagesTotal = Math.ceil(itemsTotal / pageSize);
    const canLoadMore = currentPage < pagesTotal;

    const [{ error, loading: isLoading, value }, loadMoreFn] = useAsyncFn(async () => {
        const newData = await fetchingFn();
        setCurrentPage((page) => page + 1);
        return newData;
    });

    const loadMore = useCallback(() => {
        if (canLoadMore) {
            loadMoreFn();
        }
    }, [canLoadMore, loadMoreFn]);

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
    };
}
