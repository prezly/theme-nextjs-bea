'use client';

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

interface Context {
    isPreview: boolean;
    isSecretStoryPage: boolean;
    setPreview: (preview: boolean) => void;
    setSecretStoryPage: (secret: boolean) => void;
}

const context = createContext<Context>({
    isPreview: false,
    isSecretStoryPage: false,
    setPreview: (_preview) => {},
    setSecretStoryPage: (_secret) => {},
});

interface Props {
    children: ReactNode;
}

export function BroadcastPreviewProvider({ children }: Props) {
    const [isPreview, setPreview] = useState(false);
    const [isSecretStoryPage, setSecretStoryPage] = useState(false);

    return (
        <context.Provider value={{ isPreview, isSecretStoryPage, setPreview, setSecretStoryPage }}>
            {children}
        </context.Provider>
    );
}

export function BroadcastPreview(props: { isPreview: boolean; isScretStoryPage?: boolean }) {
    useBroadcastPreview(props.isPreview, props.isScretStoryPage);

    return null;
}

export function useBroadcastPreview(isPreview: boolean, isSecretStorypage?: boolean) {
    const { setPreview, setSecretStoryPage } = usePreviewContext();

    useEffect(() => {
        setPreview(isPreview);
        setSecretStoryPage(isSecretStorypage ?? false);
    }, [isPreview, setPreview, isSecretStorypage, setSecretStoryPage]);
}

export function usePreviewContext() {
    const previewContext = useContext(context);

    return previewContext;
}
