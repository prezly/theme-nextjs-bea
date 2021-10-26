import { ExtendedStory } from '@prezly/sdk';

import { EmbargoExtendedStory } from '../types';

const isEmbargoExtendedStory = (story: ExtendedStory): story is EmbargoExtendedStory =>
    story.is_embargo && Boolean(story.published_at);

export default isEmbargoExtendedStory;
