'use client';

import { useEffect } from 'react';

import { useMaskParam } from '@/hooks';

function getLinkFromEventTarget(target: EventTarget | null): HTMLAnchorElement | null {
    if (!(target instanceof Element)) {
        return null;
    }

    const link = target.closest('a[href]');

    return link instanceof HTMLAnchorElement ? link : null;
}

function preventLinkNavigation(event: MouseEvent) {
    const link = getLinkFromEventTarget(event.target);

    if (!link) {
        return;
    }

    event.preventDefault();
}

export function PreviewPageMask() {
    const mask = useMaskParam();

    useEffect(() => {
        if (!mask) {
            return;
        }

        document.addEventListener('click', preventLinkNavigation, true);
        document.addEventListener('auxclick', preventLinkNavigation, true);

        return () => {
            document.removeEventListener('click', preventLinkNavigation, true);
            document.removeEventListener('auxclick', preventLinkNavigation, true);
        };
    }, [mask]);

    return null;
}
