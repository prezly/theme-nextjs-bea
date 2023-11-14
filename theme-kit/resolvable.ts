/* eslint-disable @typescript-eslint/no-use-before-define */

export type Resolvable<T> = T | DynamicallyResolvable<T>;
export type AsyncResolvable<T> = T | DynamicallyResolvable<T> | AsyncDynamicallyResolvable<T>;

type DynamicallyResolvable<T> = () => T;
type AsyncDynamicallyResolvable<T> = () => Promise<T>;

type Awaitable<T> = T | Promise<T>;

export function resolvable<T>(value: Resolvable<T>): () => T {
    let resolved: { value: T } | undefined;

    return () => {
        if (!resolved) {
            resolved = { value: resolve(value) };
        }
        return resolved.value;
    };
}

export function asyncResolvable<T>(value: AsyncResolvable<T>): () => Awaitable<T> {
    let resolved: { value: T } | undefined;

    return async () => {
        if (!resolved) {
            resolved = { value: (await resolveAsync(value)) as T };
        }
        return resolved.value;
    };
}

export function resolve<T>(value: T | DynamicallyResolvable<T>): T {
    if (typeof value === 'function') {
        return (value as DynamicallyResolvable<T>)();
    }
    return value;
}

export function resolveAsync<T>(
    value: T | DynamicallyResolvable<T> | AsyncDynamicallyResolvable<T>,
): Awaitable<T> {
    if (typeof value === 'function') {
        return Promise.resolve((value as AsyncDynamicallyResolvable<T>)());
    }
    return value;
}

export function multiResolveAsync<T1, T2>(
    values: [AsyncResolvable<T1>, AsyncResolvable<T2>],
): Promise<[T1, T2]>;

export function multiResolveAsync<T1, T2, T3>(
    values: [AsyncResolvable<T1>, AsyncResolvable<T2>, AsyncResolvable<T3>],
): Promise<[T1, T2, T3]>;

export function multiResolveAsync<T1, T2, T3, T4>(
    values: [AsyncResolvable<T1>, AsyncResolvable<T2>, AsyncResolvable<T3>, AsyncResolvable<T4>],
): Promise<[T1, T2, T3, T4]>;

export function multiResolveAsync<T1, T2, T3, T4, T5>(
    values: [
        AsyncResolvable<T1>,
        AsyncResolvable<T2>,
        AsyncResolvable<T3>,
        AsyncResolvable<T4>,
        AsyncResolvable<T5>,
    ],
): Promise<[T1, T2, T3, T4, T5]>;

export function multiResolveAsync<T1, T2, T3, T4, T5, T6>(
    values: [
        AsyncResolvable<T1>,
        AsyncResolvable<T2>,
        AsyncResolvable<T3>,
        AsyncResolvable<T4>,
        AsyncResolvable<T5>,
        AsyncResolvable<T6>,
    ],
): Promise<[T1, T2, T3, T4, T5, T6]>;

export function multiResolveAsync<T>(values: AsyncResolvable<T>[]): Promise<T[]>;

export function multiResolveAsync<T>(values: AsyncResolvable<T>[]): Promise<T[]> {
    const resolutions = values.map((value) => resolveAsync(value));
    return Promise.all(resolutions);
}
