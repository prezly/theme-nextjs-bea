import { Story } from '@prezly/sdk';

import { EmbargoStory } from '../types';

const isEmbargoStory = (story: Story): story is EmbargoStory =>
    story.is_embargo && Boolean(story.published_at);

export default isEmbargoStory;
