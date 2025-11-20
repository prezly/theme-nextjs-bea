'use client';

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

interface Context {
    isSecretStoryPage: boolean;
    setSecretStoryPage: (secret: boolean) => void;
}

const context = createContext<Context>({
    isSecretStoryPage: false,
    setSecretStoryPage: (_secret) => {},
});

interface Props {
    children: ReactNode;
}

export function BroadcastPreviewProvider({ children }: Props) {
    const [isSecretStoryPage, setSecretStoryPage] = useState(false);

    return (
        <context.Provider value={{ isSecretStoryPage, setSecretStoryPage }}>
            {children}
        </context.Provider>
    );
}

export function BroadcastPreview(props: { isSecretStoryPage?: boolean }) {
    useBroadcastPreview(props.isSecretStoryPage);

    return null;
}

export function useBroadcastPreview(isSecretStorypage?: boolean) {
    const { setSecretStoryPage } = usePreviewContext();

    useEffect(() => {
        setSecretStoryPage(isSecretStorypage ?? false);

        return () => {
            setSecretStoryPage(false);
        };
    }, [isSecretStorypage, setSecretStoryPage]);
}

export function usePreviewContext() {
    const previewContext = useContext(context);

    return previewContext;
}
