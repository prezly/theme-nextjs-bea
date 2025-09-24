import { Newsroom, SortOrder, Story } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';
import type { ThemeSettings } from '@/theme-settings';

import { InfiniteHubStories } from '../InfiniteHubStories';

interface Props {
    layout: ThemeSettings['layout'];
    localeCode: Locale.Code;
    pageSize: number;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
}

export async function HubStories({
    layout,
    localeCode,
    pageSize,
    showDate,
    showSubtitle,
    storyCardVariant,
}: Props) {
    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(localeCode);

    const { newsrooms, pagination, stories } = await getStories({
        localeCode,
        newsroomUuid: newsroom.uuid,
        pageSize,
    });

    return (
        <InfiniteHubStories
            initialStories={stories}
            layout={layout}
            newsroomName={languageSettings.company_information.name || newsroom.name}
            newsrooms={[newsroom, ...newsrooms]}
            newsroomUuid={newsroom.uuid}
            pageSize={pageSize}
            showDate={showDate}
            showSubtitle={showSubtitle}
            storyCardVariant={storyCardVariant}
            total={pagination.matched_records_number}
        />
    );
}

async function getStories({
    localeCode,
    newsroomUuid,
    pageSize,
}: {
    localeCode: Locale.Code;
    newsroomUuid: string;
    pageSize: number;
}) {
    const members = await app().client.newsroomHub.list(newsroomUuid);
    const activeMembers = members.filter((member) => Newsroom.isActive(member.newsroom));

    const { pagination, stories } = await app().client.stories.search({
        limit: pageSize,
        include: ['thumbnail_image'],
        sortOrder: SortOrder.desc('published_at'),
        query: {
            $and: [
                { 'locale': { $in: [localeCode] } },
                { 'status': { $in: [Story.Status.PUBLISHED] } },
                { 'visibility': { $in: [Story.Visibility.PUBLIC] } },
                {
                    'newsroom.uuid': {
                        $in: [
                            newsroomUuid,
                            ...activeMembers
                                .filter((member) => member.is_displaying_stories_in_hub)
                                .map((member) => member.newsroom.uuid),
                        ],
                    },
                },
            ],
        },
    });

    return {
        newsrooms: activeMembers.map((member) => member.newsroom),
        pagination,
        stories,
    };
}
