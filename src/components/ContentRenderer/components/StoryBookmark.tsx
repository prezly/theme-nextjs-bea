'use client';

import { Elements } from '@prezly/content-renderer-react-js';
import type { ExtendedStory, Story } from '@prezly/sdk';
import type { StoryBookmarkNode } from '@prezly/story-content-format';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface Props {
    node: StoryBookmarkNode;
}

export function StoryBookmark({ node }: Props) {
    const referencedStory = useReferencedStory(node.story.uuid);

    if (!referencedStory) {
        return null;
    }

    return <Elements.StoryBookmark node={node} storyOEmbedInfo={referencedStory} />;
}

type Context = ExtendedStory['referenced_entities']['stories'];

const context = createContext<Context>({});

export function StoryBookmarkContextProvider(props: {
    referencedStories: Context;
    children: ReactNode;
}) {
    return <context.Provider value={props.referencedStories}>{props.children}</context.Provider>;
}

function useReferencedStory(uuid: Story['uuid']) {
    const referencedStories = useContext(context);

    return referencedStories[uuid];
}
