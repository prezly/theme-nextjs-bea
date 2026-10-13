import type { Story } from '@prezly/sdk';
import type { ContentDelivery, Locale } from '@prezly/theme-kit-nextjs';

import { type PublicStory, sanitizeStories } from './sanitizeStory';

export async function getRelatedStories<T extends Story>(
    listStories: (params: ContentDelivery.stories.SearchParams) => Promise<{ stories: T[] }>,
    {
        story,
        locale,
        showReadMore,
    }: { story: Pick<Story, 'uuid'>; locale: Locale.Code; showReadMore: boolean },
): Promise<PublicStory<T>[]> {
    if (!showReadMore) return [];

    // ContentDelivery orders pinned stories first, then publication date, and
    // restricts the list to this newsroom's published/public stories. Four
    // candidates leave three after excluding the current story, without a
    // different list-cache key per story. The caller retains its cache/preview scope.
    const { stories } = await listStories({ limit: 4, locale });
    return sanitizeStories(stories.filter(({ uuid }) => uuid !== story.uuid).slice(0, 3));
}
