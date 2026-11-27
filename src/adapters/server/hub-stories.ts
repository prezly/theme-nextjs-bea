import { Newsroom, type PrezlyClient, SortOrder, Story } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

interface Params {
    offset: number | undefined;
    limit: number;
    locale: Locale.Code | null;
}

/**
 * Stories of a hub and of the member sites that show their stories in it.
 *
 * Returns `null` for a site that is not a hub: it has no hub stories, and the API
 * refuses to list hub members for it (409 Conflict).
 */
export async function fetchHubStories(
    client: PrezlyClient,
    newsroom: Pick<Newsroom, 'uuid' | 'is_hub'>,
    { offset, limit, locale }: Params,
) {
    if (!newsroom.is_hub) return null;

    const members = await client.newsroomHub.list(newsroom.uuid);
    const activeAndIncludedMembers = members.filter(
        (member) => Newsroom.isActive(member.newsroom) && member.is_displaying_stories_in_hub,
    );

    const { pagination, stories } = await client.stories.search({
        offset,
        limit,
        include: ['thumbnail_image'],
        sortOrder: SortOrder.desc('published_at'),
        query: {
            $and: [
                { locale: { $in: [locale] } },
                { status: { $in: [Story.Status.PUBLISHED] } },
                { visibility: { $in: [Story.Visibility.PUBLIC] } },
                {
                    'newsroom.uuid': {
                        $in: [
                            newsroom.uuid,
                            ...activeAndIncludedMembers.map((member) => member.newsroom.uuid),
                        ],
                    },
                },
            ],
        },
    });

    return { stories, total: pagination.matched_records_number };
}
