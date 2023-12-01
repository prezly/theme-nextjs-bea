'use client';

import { useCallback, useRef } from 'react';

export function useDebounce<T extends (...params: never[]) => void>(milliseconds: number, fn: T) {
    const fnRef = useRef<T>(fn);

    // TODO: This can potentially lead to bugs in future React versions [DEV-11206]
    // @see https://github.com/facebook/react/issues/16956#issuecomment-536636418
    fnRef.current = fn;

    const timer = useRef<number>();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback<T>(
        ((...params) => {
            clearTimeout(timer.current);
            setTimeout(() => fnRef.current(...params), milliseconds);
        }) as T,
        [fnRef, timer, milliseconds],
    );
}
