'use client';

import { useEffect } from 'react';

type OnScrollMessage = {
    type: 'onScroll';
    value: number;
};

type ScrollToMessage = {
    type: 'scrollTo';
    value: number;
};

export function WindowScrollListener() {
    useEffect(() => {
        function onScroll() {
            window.parent.postMessage(
                {
                    type: 'onScroll',
                    value: window.scrollY,
                } satisfies OnScrollMessage,
                '*',
            );
        }

        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        function onMessage(event: MessageEvent<ScrollToMessage>) {
            if (event.data.type === 'scrollTo') {
                window.scrollTo({ top: event.data.value });
            }
        }

        window.addEventListener('message', onMessage);

        return () => window.removeEventListener('message', onMessage);
    }, []);

    return null;
}
