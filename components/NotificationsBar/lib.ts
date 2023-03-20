import { type RefObject, useEffect, useRef } from 'react';

function useLatestValue<T>(value: T): RefObject<T> {
    const ref = useRef<T>(value);
    ref.current = value;
    return ref;
}

export function useOnResize(onResize: () => void) {
    const callback = useLatestValue(onResize);

    useEffect(() => {
        callback.current?.();

        function handleResize() {
            callback.current?.();
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [callback]);
}
