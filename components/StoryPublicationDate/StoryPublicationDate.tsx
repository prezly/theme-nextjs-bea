import type { Story } from '@prezly/sdk';
import type { AlgoliaStory } from '@prezly/theme-kit-nextjs';
import { getStoryPublicationDate } from '@prezly/theme-kit-nextjs';
import { FormattedDate } from 'react-intl';

interface Props {
    story: Story | AlgoliaStory;
}

function StoryPublicationDate({ story }: Props) {
    const date = getStoryPublicationDate(story);

    if (!date) {
        return null;
    }

    return <FormattedDate value={date} year="numeric" month="long" day="numeric" />;
}

export default StoryPublicationDate;
