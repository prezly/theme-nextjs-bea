'use client';

import { useEffect } from 'react';

interface Props {
    className: string;
}

export function AttachBodyClass({ className }: Props) {
    useEffect(() => {
        document.body.classList.add(className);

        return () => {
            document.body.classList.remove(className);
        };
    }, [className]);

    return null;
}
