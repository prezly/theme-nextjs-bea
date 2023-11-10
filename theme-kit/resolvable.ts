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
            resolved = { value: (await asyncResolve(value)) as T };
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

export function asyncResolve<T>(
    value: T | DynamicallyResolvable<T> | AsyncDynamicallyResolvable<T>,
): Awaitable<T> {
    if (typeof value === 'function') {
        return Promise.resolve((value as AsyncDynamicallyResolvable<T>)());
    }
    return value;
}
