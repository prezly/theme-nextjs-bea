import type { Story } from '@prezly/sdk';

import type { EmbargoStory } from '../types';

export function isEmbargoStory(story: Story): story is EmbargoStory {
    return story.is_embargo && Boolean(story.published_at);
}
