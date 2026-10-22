'use client';

import { Elements } from '@prezly/content-renderer-react-js';
import type { ExtendedStory, Story } from '@prezly/sdk';
import type { StoryBookmarkNode } from '@prezly/story-content-format';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { useBasePathConfig, useLocale } from '@/adapters/client';
import { applyBasePathAbsolute } from '@/utils';

interface Props {
    node: StoryBookmarkNode;
}

export function StoryBookmark({ node }: Props) {
    const referencedStory = useReferencedStory(node.story.uuid);
    const basePathConfig = useBasePathConfig();
    const currentLocale = useLocale();

    if (!referencedStory) {
        return null;
    }

    return (
        <Elements.StoryBookmark
            node={node}
            storyOEmbedInfo={{
                ...referencedStory,
                // Re-apply the theme's reverse-proxy prefix to the backend-provided
                // absolute URL. The referenced-story oembed carries no locale, so we
                // prefix with the current page locale; the middleware strips the
                // locale for story routes anyway and `resolveLocale` recovers the
                // real one from the slug. No-op when unconfigured.
                url: applyBasePathAbsolute(referencedStory.url, basePathConfig, currentLocale),
            }}
        />
    );
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
