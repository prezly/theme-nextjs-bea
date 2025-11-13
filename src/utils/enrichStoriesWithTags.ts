import type { ListStory } from '@/types';

/**
 * Enriches stories with tag data from the v2 API
 */
export async function enrichStoriesWithTags(stories: ListStory[]): Promise<ListStory[]> {
    if (!stories.length) return stories;

    try {
        // Fetch tag data from v2 API for each story individually
        const tagMap = new Map<string, string[]>();

        // Process stories in batches to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < stories.length; i += batchSize) {
            const batch = stories.slice(i, i + batchSize);
            const promises = batch.map(async (story) => {
                try {
                    const response = await fetch(
                        `https://api.prezly.com/v2/stories/${story.uuid}`,
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.PREZLY_ACCESS_TOKEN}`,
                                // eslint-disable-next-line
                                'Content-Type': 'application/json',
                            },
                        },
                    );

                    if (response.ok) {
                        const v2Story = await response.json();
                        if (v2Story.story?.tag_names) {
                            tagMap.set(story.uuid, v2Story.story.tag_names);
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to fetch tags for story ${story.uuid}:`, error);
                }
            });

            await Promise.all(promises);
        }

        // Enrich stories with tag data
        const enrichedStories = stories.map((story) => ({
            ...story,
            tags: tagMap.get(story.uuid) || [],
        }));

        return enrichedStories;
    } catch (error) {
        console.warn('Error enriching stories with tags:', error);
        return stories;
    }
}

/**
 * Sorts stories by tag order (e.g., #1, #2, #3)
 */
export function sortStoriesByTagOrder(stories: ListStory[]): ListStory[] {
    return [...stories].sort((a, b) => {
        const aTags = a.tags || [];
        const bTags = b.tags || [];

        // Extract numeric values from tags (e.g., "#1" -> 1)
        const aNumbers = aTags.map((tag) => {
            const match = tag.match(/#(\d+)/);
            return match ? Number.parseInt(match[1], 10) : Number.POSITIVE_INFINITY;
        });

        const bNumbers = bTags.map((tag) => {
            const match = tag.match(/#(\d+)/);
            return match ? Number.parseInt(match[1], 10) : Number.POSITIVE_INFINITY;
        });

        // Get the minimum number for each story (in case of multiple tags)
        const aMin = Math.min(...aNumbers);
        const bMin = Math.min(...bNumbers);

        // Sort by numeric order, stories without numeric tags go last
        if (aMin === Number.POSITIVE_INFINITY && bMin === Number.POSITIVE_INFINITY) return 0;
        if (aMin === Number.POSITIVE_INFINITY) return 1;
        if (bMin === Number.POSITIVE_INFINITY) return -1;

        return aMin - bMin;
    });
}
