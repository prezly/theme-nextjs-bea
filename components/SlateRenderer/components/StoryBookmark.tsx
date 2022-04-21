import { Elements } from '@prezly/content-renderer-react-js';
import type { StoryBookmarkNode } from '@prezly/slate-types';
import { useCurrentStory } from '@prezly/theme-kit-nextjs';

interface Props {
    node: StoryBookmarkNode;
}

export function StoryBookmark({ node }: Props) {
    const currentStory = useCurrentStory();

    return <Elements.StoryBookmark node={node} story={currentStory.storiesHash[node.story.uuid]} />;
}
