import { Elements } from '@prezly/content-renderer-react-js';
import type { StoryBookmarkNode } from '@prezly/story-content-format';
import { useCurrentStory } from '@prezly/theme-kit-nextjs';

interface Props {
    node: StoryBookmarkNode;
}

export function StoryBookmark({ node }: Props) {
    const story = useCurrentStory();
    const referencedStory = story?.referenced_entities?.stories?.[node.story.uuid];

    if (!referencedStory) {
        return null;
    }

    return <Elements.StoryBookmark node={node} storyOEmbedInfo={referencedStory} />;
}
