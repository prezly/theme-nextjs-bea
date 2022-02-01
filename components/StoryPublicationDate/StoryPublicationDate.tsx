import type { Story } from '@prezly/sdk';
import { AlgoliaStory, getStoryPublicationDate } from '@prezly/theme-kit-nextjs';
import { FunctionComponent } from 'react';
import { FormattedDate } from 'react-intl';

interface Props {
    story: Story | AlgoliaStory;
}

const StoryPublicationDate: FunctionComponent<Props> = ({ story }) => {
    const date = getStoryPublicationDate(story);

    if (!date) {
        return null;
    }

    return <FormattedDate value={date} year="numeric" month="long" day="numeric" />;
};

export default StoryPublicationDate;
