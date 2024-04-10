'use client';

import type { Story } from '@prezly/sdk';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Revoke = () => void;

interface Context {
    story: Story | null;
    broadcast: (story: Story) => Revoke;
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
    const [story, setStory] = useState<Story | null>(null);

    const broadcast = useCallback((storyToBroadcast: Story) => {
        setStory(storyToBroadcast);

        return () => setStory(null);
    }, []);

    const value = useMemo(() => ({ story, broadcast }), [broadcast, story]);

    return <context.Provider value={value}>{props.children}</context.Provider>;
}
export function BroadcastStory(props: { story: Story }) {
    useBroadcastStory(props.story);

    return null;
}

export function useBroadcastStory(story: Story) {
    const { broadcast } = useContext(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => broadcast(story), [story]);
}

export function useBroadcastedStory(): Story | null {
    return useContext(context).story;
}
