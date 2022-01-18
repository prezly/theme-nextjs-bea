import type { Story } from '@prezly/sdk';
import { FormattedDate } from 'react-intl';

import { AlgoliaStory } from 'types';

export default function getStoryPublicationDate(story: Story | AlgoliaStory) {
    const { published_at } = story;

    if (!published_at) {
        return null;
    }

    return (
        <FormattedDate value={new Date(published_at)} year="numeric" month="long" day="numeric" />
    );
}
