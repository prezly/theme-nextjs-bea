import { useEffect, useRef } from 'react';

export default function useIsMonuted() {
    const isMountedRef = useRef<boolean>(true);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return isMountedRef;
}
