'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Revoke = () => void;

enum PageType {
    SEARCH = 'search',
}

interface Context {
    types: `${PageType}`[];
    broadcast: (pageType: `${PageType}`) => Revoke;
}

const context = createContext<Context>({
    types: [],
    broadcast() {
        throw new Error(
            'This functionality requires `BroadcastPageTypeProvider` mounted up the components tree.',
        );
    },
});

interface Entry {
    type: `${PageType}`;
}

export function BroadcastPageTypesProvider(props: { children: ReactNode }) {
    const [entries, setEntries] = useState<Entry[]>([]);

    const broadcast = useCallback(
        (type: `${PageType}`) => {
            const entry: Entry = { type };

            setEntries((prev) => [...prev, entry]);

            return () => setEntries((prev) => prev.filter((existing) => existing !== entry));
        },
        [setEntries],
    );

    const value = useMemo(() => {
        const types = entries.map((entry) => entry.type);
        return { types, broadcast };
    }, [entries, broadcast]);

    return <context.Provider value={value}>{props.children}</context.Provider>;
}
export function BroadcastPageType(props: { pageType: `${PageType}` }) {
    useBroadcastPageType(props.pageType);

    return null;
}

export function useBroadcastPageType(pageType: `${PageType}`) {
    const { broadcast } = useContext(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => broadcast(pageType), [pageType]);
}

export function useBroadcastedPageTypes(): `${PageType}`[] {
    return useContext(context).types;
}

export function useBroadcastedPageTypeCheck(pageType: `${PageType}`): boolean {
    return useBroadcastedPageTypes().includes(pageType);
}
