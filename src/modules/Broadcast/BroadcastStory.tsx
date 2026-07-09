'use client';

import type { Story } from '@prezly/sdk';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Revoke = () => void;
type BroadcastedStory = Pick<Story, 'id' | 'uuid'>;

interface Context {
    story: BroadcastedStory | null;
    broadcast: (story: BroadcastedStory) => Revoke;
}

const context = createContext<Context>({
    story: null,
    broadcast() {
        throw new Error(
            'This functionality requires `BroadcastStoryProvider` mounted up the components tree.',
        );
    },
});

export function BroadcastStoryProvider(props: { children: ReactNode }) {
    const [story, setStory] = useState<BroadcastedStory | null>(null);

    const broadcast = useCallback((storyToBroadcast: BroadcastedStory) => {
        setStory(storyToBroadcast);

        return () => setStory(null);
    }, []);

    const value = useMemo(() => ({ story, broadcast }), [broadcast, story]);

    return <context.Provider value={value}>{props.children}</context.Provider>;
}
export function BroadcastStory(props: { story: BroadcastedStory }) {
    useBroadcastStory(props.story);

    return null;
}

export function useBroadcastStory(story: BroadcastedStory) {
    const { broadcast } = useContext(context);
    useEffect(() => broadcast(story), [story, broadcast]);
}

export function useBroadcastedStory(): BroadcastedStory | null {
    return useContext(context).story;
}
