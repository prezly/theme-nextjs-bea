'use client';

import type { UploadedImage } from '@prezly/sdk';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface FallbackContext {
    image: UploadedImage | null;
    text: string;
}

const context = createContext<FallbackContext>({ image: null, text: '' });

export function FallbackProvider(props: FallbackContext & { children: ReactNode }) {
    const { children, ...value } = props;
    return <context.Provider value={value}>{children}</context.Provider>;
}

export function useFallback(): FallbackContext {
    return useContext(context);
}
