import type { Story } from '@prezly/sdk';
import { FormattedDate } from 'react-intl';

import { AlgoliaStory } from 'types';

export default function getStoryPublicationDate(story: Story | AlgoliaStory) {
    const { published_at } = story;

    if (!published_at) {
        return null;
    }

    const date =
        typeof published_at === 'string' ? new Date(published_at) : new Date(published_at * 1000);

    return <FormattedDate value={date} year="numeric" month="long" day="numeric" />;
}
