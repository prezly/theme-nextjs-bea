import { Elements } from '@prezly/content-renderer-react-js';
import type { StoryBookmarkNode } from '@prezly/slate-types';
import { useCurrentStory } from '@prezly/theme-kit-nextjs';

interface Props {
    node: StoryBookmarkNode;
}

export function StoryBookmark({ node }: Props) {
    const story = useCurrentStory();
    const storyOEmbedInfo = story?.referenced_entities?.stories?.[node.story.uuid];

    if (!storyOEmbedInfo) {
        return null;
    }

    return <Elements.StoryBookmark node={node} storyOEmbedInfo={storyOEmbedInfo} />;
}
