import type { VariableNode } from '@prezly/story-content-format';
import { useCurrentStory } from '@prezly/theme-kit-nextjs';
import { StoryPublicationDate } from '@prezly/themes-ui-components';

interface Props {
    node: VariableNode;
}

export function Variable({ node }: Props) {
    const currentStory = useCurrentStory();

    if (!currentStory) {
        return null;
    }

    // TODO: `PlaceholderNode` doesn't have correct types for `key` property
    if (node.key === 'publication.date') {
        return <StoryPublicationDate story={currentStory} />;
    }

    return null;
}
