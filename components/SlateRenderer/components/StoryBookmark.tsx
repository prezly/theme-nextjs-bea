import { Elements } from '@prezly/content-renderer-react-js';
import type { StoryBookmarkNode } from '@prezly/slate-types';
import { useEmbedStory } from '@prezly/theme-kit-nextjs';

interface Props {
    node: StoryBookmarkNode;
}

export function StoryBookmark({ node }: Props) {
    const embedStory = useEmbedStory(node.story.uuid);

    if (!embedStory) {
        return null;
    }

    return <Elements.StoryBookmark node={node} story={embedStory} />;
}
