import type { Story } from '@prezly/sdk';
import { FormattedDate } from 'react-intl';

export default function getStoryPublicationDate(story: Story) {
    const { published_at } = story;

    if (!published_at) {
        return null;
    }

    return (
        <FormattedDate value={new Date(published_at)} year="numeric" month="long" day="numeric" />
    );
}
