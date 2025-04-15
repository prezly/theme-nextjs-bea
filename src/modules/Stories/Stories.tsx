import type { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';
import type { ThemeSettings } from '@/theme-settings';

import { InfiniteStories } from '../InfiniteStories';

interface Props {
    categoryId: Category['id'] | undefined;
    fullWidthFeaturedStory: boolean;
    layout: ThemeSettings['layout'];
    localeCode: Locale.Code;
    pageSize: number;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
}

export async function Stories({
    categoryId,
    fullWidthFeaturedStory,
    layout,
    localeCode,
    pageSize,
    showDate,
    showSubtitle,
    storyCardVariant,
}: Props) {
    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(localeCode);

    const { categories, stories, pagination, excludedStoryUuids } = await getStories({
        categoryId,
        localeCode,
        pageSize,
    });

    return (
        <InfiniteStories
            key={categoryId}
            categories={categories}
            category={categoryId ? { id: categoryId } : undefined}
            excludedStoryUuids={excludedStoryUuids}
            fullWidthFeaturedStory={fullWidthFeaturedStory}
            initialStories={stories}
            layout={layout}
            newsroomName={languageSettings.company_information.name || newsroom.name}
            pageSize={pageSize}
            showDate={showDate}
            showSubtitle={showSubtitle}
            storyCardVariant={storyCardVariant}
            total={pagination.matched_records_number}
        />
    );
}

async function getStories({
    categoryId,
    localeCode,
    pageSize,
}: {
    categoryId: number | undefined;
    localeCode: Locale.Code;
    pageSize: number;
}) {
    const categories = await app().categories();
    const featuredCategories = categories.filter(
        ({ is_featured, i18n }) => is_featured && i18n[localeCode]?.public_stories_number > 0,
    );

    if (featuredCategories.length > 0) {
        const { stories: pinnedOrMostRecentStories } = await app().stories({
            // We're fetching two stories, so we can later determine if we can
            // show the category filters.
            limit: 2,
            locale: { code: localeCode },
        });

        const [pinnedOrMostRecentStory] = pinnedOrMostRecentStories;

        // Exclude the pinned/most recent story from the initial stories list
        // so it's not duplicated below the categories filters
        const query = pinnedOrMostRecentStory
            ? {
                  uuid: { $nin: [pinnedOrMostRecentStory.uuid] },
              }
            : undefined;

        const { stories, pagination } = await app().stories({
            category: categoryId ? { id: categoryId } : undefined,
            limit: pageSize - 1,
            locale: { code: localeCode },
            query,
        });

        // If there's less than 2 stories in total, we do not provide
        // categories so the filters will not be displayed.
        const hasOneStoryOrLess = pinnedOrMostRecentStories.length < 2;

        return {
            categories: hasOneStoryOrLess ? undefined : featuredCategories,
            stories: pinnedOrMostRecentStory ? [pinnedOrMostRecentStory, ...stories] : [],
            pagination,
            excludedStoryUuids: pinnedOrMostRecentStory
                ? [pinnedOrMostRecentStory.uuid]
                : undefined,
        };
    }

    const { stories, pagination } = await app().stories({
        limit: pageSize,
        locale: { code: localeCode },
    });

    return { stories, pagination };
}
