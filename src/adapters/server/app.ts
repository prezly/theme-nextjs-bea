import type { ContentDelivery } from '@prezly/theme-kit-nextjs';
import { AppHelperAdapter } from '@prezly/theme-kit-nextjs/server';
import { headers } from 'next/headers';

import { initPrezlyClient } from './prezly';
import { themeSettings } from './theme-settings';

export const { useApp: app } = AppHelperAdapter.connect({
    identifyRequestContext: () => headers(),
    createAppHelper: () => {
        const { client, contentDelivery } = initPrezlyClient();

        function story(params: ContentDelivery.story.SearchParams) {
            return contentDelivery.story(params);
        }

        function stories(params: ContentDelivery.stories.SearchParams) {
            return contentDelivery.stories(params, { include: ['thumbnail_image'] });
        }

        function allStories(params?: ContentDelivery.allStories.SearchParams) {
            return contentDelivery.allStories(params, { include: ['thumbnail_image'] });
        }

        async function policies() {
            const { uuid } = await contentDelivery.newsroom();
            const { policies: result } = await client.newsrooms.get(uuid, {
                include: ['policies'],
            });
            return result;
        }

        return {
            ...contentDelivery,
            client,
            timezone: () => contentDelivery.newsroom().then((newsroom) => newsroom.timezone),
            story,
            stories,
            allStories,
            themeSettings,
            policies,
            dateFormat: () => contentDelivery.newsroom().then((newsroom) => newsroom.date_format),
            timeFormat: () => contentDelivery.newsroom().then((newsroom) => newsroom.time_format),
        };
    },
});
