import type { PlaceholderNode } from '@prezly/slate-types';
import { useCurrentStory } from '@prezly/theme-kit-nextjs';

import { StoryPublicationDate } from '@/components';

interface Props {
    node: PlaceholderNode;
}

function Placeholder({ node }: Props) {
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

export default Placeholder;
