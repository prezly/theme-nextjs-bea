'use client';

import { useEffect } from 'react';

import { useMaskParam } from '@/hooks';

const CAPTURE_OPTIONS: AddEventListenerOptions = { capture: true };

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

function preventFormNavigation(event: Event) {
    event.preventDefault();
    event.stopPropagation();
}

export function PreviewPageMask() {
    const mask = useMaskParam();

    useEffect(() => {
        if (!mask) {
            return;
        }

        document.addEventListener('click', preventLinkNavigation, CAPTURE_OPTIONS);
        document.addEventListener('auxclick', preventLinkNavigation, CAPTURE_OPTIONS);
        document.addEventListener('submit', preventFormNavigation, CAPTURE_OPTIONS);

        return () => {
            document.removeEventListener('click', preventLinkNavigation, CAPTURE_OPTIONS);
            document.removeEventListener('auxclick', preventLinkNavigation, CAPTURE_OPTIONS);
            document.removeEventListener('submit', preventFormNavigation, CAPTURE_OPTIONS);
        };
    }, [mask]);

    return null;
}
