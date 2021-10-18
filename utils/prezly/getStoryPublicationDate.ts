import { Story } from '@prezly/sdk';
import { format } from 'date-fns';

export default function getStoryPublicationDate(story: Story) {
    const { published_at } = story;

    if (!published_at) {
        return null;
    }

    return format(new Date(published_at as string), 'MMMM d, y');
}
