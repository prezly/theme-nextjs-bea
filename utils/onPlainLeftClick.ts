import type { MouseEventHandler } from 'react';

export function onPlainLeftClick<T extends HTMLElement>(
    callback?: MouseEventHandler<T>,
): MouseEventHandler<T> {
    return (event) => {
        if (
            event.button === 0 &&
            !event.altKey &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.shiftKey
        ) {
            callback?.(event);
        }
    };
}
