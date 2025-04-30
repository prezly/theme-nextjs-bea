import { Newsroom, SortOrder, Story } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { headers } from 'next/headers';

import { app, environment, initPrezlyClient } from '@/adapters/server';
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
        pageSize,
    });

    return (
        <InfiniteHubStories
            initialStories={stories}
            layout={layout}
            newsroomName={languageSettings.company_information.name || newsroom.name}
            newsrooms={newsrooms}
            pageSize={pageSize}
            showDate={showDate}
            showSubtitle={showSubtitle}
            storyCardVariant={storyCardVariant}
            total={pagination.matched_records_number}
        />
    );
}

async function getStories({ localeCode, pageSize }: { localeCode: Locale.Code; pageSize: number }) {
    const requestHeaders = await headers();
    const env = environment(requestHeaders);

    const includedNewsroomsClient = initPrezlyClient(requestHeaders, {
        accessToken: env.PREZLY_INCLUDED_NEWSROOMS_ACCESS_TOKEN,
    });

    const includedStoriesClient = initPrezlyClient(requestHeaders, {
        accessToken: env.PREZLY_INCLUDED_STORIES_ACCESS_TOKEN,
    });

    const { newsrooms } = await includedNewsroomsClient.client.newsrooms.search({
        limit: 50,
        sortOrder: '+display_name',
        query: {
            $and: [{ status: { $eq: Newsroom.Status.ACTIVE } }],
        },
    });

    const { pagination, stories } = await includedStoriesClient.client.stories.search({
        limit: pageSize,
        include: ['thumbnail_image'],
        sortOrder: SortOrder.desc('published_at'),
        query: {
            $and: [
                { [`locale`]: { $in: [localeCode] } },
                { [`status`]: { $in: [Story.Status.PUBLISHED] } },
                { [`visibility`]: { $in: [Story.Visibility.PUBLIC] } },
            ],
        },
    });

    return {
        newsrooms: newsrooms.filter((newsroom) => newsroom.square_logo),
        pagination,
        stories,
    };
}
