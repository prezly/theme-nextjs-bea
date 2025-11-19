'use client';

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

interface Context {
    isPreview: boolean;
    setPreview: (preview: boolean) => void;
}

const context = createContext<Context>({
    isPreview: false,
    setPreview: (_preview) => {},
});

interface Props {
    children: ReactNode;
}

export function BroadcastPreviewProvider({ children }: Props) {
    const [isPreview, setPreview] = useState(false);

    return <context.Provider value={{ isPreview, setPreview }}>{children}</context.Provider>;
}

export function BroadcastPreview(props: { isPreview: boolean }) {
    useBroadcastPreview(props.isPreview);

    return null;
}

export function useBroadcastPreview(isPreview: boolean) {
    const { setPreview } = usePreviewContext();

    useEffect(() => {
        setPreview(isPreview);
    }, [isPreview, setPreview]);
}

export function usePreviewContext() {
    const previewContext = useContext(context);

    return previewContext;
}
