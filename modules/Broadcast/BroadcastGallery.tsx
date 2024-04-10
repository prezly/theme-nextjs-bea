'use client';

import type { NewsroomGallery } from '@prezly/sdk';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Revoke = () => void;

interface Context {
    gallery: NewsroomGallery | null;
    broadcast: (gallery: NewsroomGallery) => Revoke;
}

const context = createContext<Context>({
    gallery: null,
    broadcast() {
        throw new Error(
            'This functionality requires `BroadcastGalleryProvider` mounted up the components tree.',
        );
    },
});

export function BroadcastGalleryProvider(props: { children: ReactNode }) {
    const [gallery, setGallery] = useState<NewsroomGallery | null>(null);

    const broadcast = useCallback(
        (galleryToBroadcast: NewsroomGallery) => {
            setGallery(galleryToBroadcast);

            return () => setGallery(null);
        },
        [setGallery],
    );

    const value = useMemo(() => ({ gallery, broadcast }), [broadcast, gallery]);

    return <context.Provider value={value}>{props.children}</context.Provider>;
}
export function BroadcastGallery(props: { gallery: NewsroomGallery }) {
    useBroadcastGallery(props.gallery);

    return null;
}

export function useBroadcastGallery(gallery: NewsroomGallery) {
    const { broadcast } = useContext(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => broadcast(gallery), [gallery]);
}

export function useBroadcastedGallery(): NewsroomGallery | null {
    return useContext(context).gallery;
}
