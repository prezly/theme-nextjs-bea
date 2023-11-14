'use client';

/* eslint-disable @typescript-eslint/no-use-before-define */

import { useCallback, useEffect, useReducer } from 'react';

const DEFAULT_RETRIES = 3;

type LoadFn<T> = (offset: number) => Promise<{
    data: T[];
    total: number;
}>;

interface Options {
    retryOnError?: number;
}

interface State<T> {
    error: Error | undefined;
    data: T[];
    loading: boolean;
    total: undefined | number;
    tries: number;
}

type Action<T> =
    | { type: 'LOAD' }
    | { type: 'LOADED'; data: T[]; offset: number; total: number }
    | { type: 'ERROR'; error: Error };

function reduce<T>(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
        case 'LOAD': {
            return { ...state, loading: true, error: undefined, tries: state.tries + 1 };
        }
        case 'LOADED': {
            const { data, offset, total } = action;
            return {
                ...state,
                loading: false,
                data: [...state.data.slice(0, offset), ...data],
                total,
                tries: 0,
            };
        }
        case 'ERROR': {
            return { ...state, loading: false, error: action.error };
        }
        default:
            return state;
    }
}

type InitializerArg<T> = Partial<Pick<State<T>, 'data' | 'total'>>;

function initReducer<T>({ data, total }: InitializerArg<T> = {}): State<T> {
    return {
        error: undefined,
        data: data ?? [],
        loading: typeof data === 'undefined',
        total,
        tries: 0,
    };
}

export function useInfiniteLoading<T>(
    fn: LoadFn<T>,
    initialData?: T[] | InitializerArg<T>,
    { retryOnError = DEFAULT_RETRIES }: Options = {},
) {
    const [state, dispatch] = useReducer(
        reduce<T>,
        initialData && Array.isArray(initialData) ? { data: initialData } : initialData,
        initReducer,
    );

    const { loading, tries, error, data, total } = state;
    const offset = data.length;

    const load = useCallback(async () => {
        if (loading) return;

        dispatch({ type: 'LOAD' });
        try {
            const loaded = await fn(offset);
            dispatch({ type: 'LOADED', offset, data: loaded.data, total: loaded.total });
        } catch (loadingError) {
            dispatch({ type: 'ERROR', error: toError(loadingError) });
        }
    }, [loading, offset, fn]);

    useEffect(() => {
        if (data.length === 0 && (typeof total === 'undefined' || total > 0)) {
            load();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (error && tries <= retryOnError) {
            load();
        }
    }, [error, tries, retryOnError, load]);

    return {
        load,
        loading,
        error,
        data,
        count: data.length,
        total,
        done: typeof total !== 'undefined' && data.length >= total,
    };
}

function toError(value: unknown): Error {
    if (value instanceof Error) {
        return value;
    }
    return new Error(`Unknown error.`);
}
