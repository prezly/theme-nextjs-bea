import type { ContentDelivery } from '@prezly/theme-kit-nextjs';
import { AppHelperAdapter } from '@prezly/theme-kit-nextjs/server';
import { headers } from 'next/headers';

import { enrichStoriesWithTags } from '@/utils';

import { initPrezlyClient } from './prezly';
import { themeSettings } from './theme-settings';

export const { useApp: app } = AppHelperAdapter.connect({
    identifyRequestContext: () => headers(),
    createAppHelper: () => {
        const { client, contentDelivery } = initPrezlyClient();

        function story(params: ContentDelivery.story.SearchParams) {
            return contentDelivery.story(params);
        }

        async function stories(params: ContentDelivery.stories.SearchParams) {
            const result = await contentDelivery.stories(params, { include: ['thumbnail_image'] });
            const enrichedStories = await enrichStoriesWithTags(result.stories);
            return {
                ...result,
                stories: enrichedStories,
            };
        }

        async function allStories(params?: ContentDelivery.allStories.SearchParams) {
            const stories = await contentDelivery.allStories(params, {
                include: ['thumbnail_image'],
            });
            const enrichedStories = await enrichStoriesWithTags(stories);
            return enrichedStories;
        }

        return {
            ...contentDelivery,
            client,
            timezone: () => contentDelivery.newsroom().then((newsroom) => newsroom.timezone),
            story,
            stories,
            allStories,
            themeSettings,
        };
    },
});
