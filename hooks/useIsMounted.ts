import { useCallback, useEffect, useRef } from 'react';

export default function useIsMounted() {
    const isMountedRef = useRef<boolean>(true);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const getIsMounted = useCallback(() => isMountedRef.current, []);

    return getIsMounted;
}
