import type { Category } from '@prezly/sdk';
import type { ContentDelivery, Locale } from '@prezly/theme-kit-nextjs';
import { AppHelperAdapter } from '@prezly/theme-kit-nextjs/server';
import { headers } from 'next/headers';

import { locale } from './locale';
import { initPrezlyClient } from './prezly';
import { themeSettings } from './theme-settings';

export const { useApp: app } = AppHelperAdapter.connect({
    identifyRequestContext: () => headers(),
    createAppHelper: () => {
        const { contentDelivery } = initPrezlyClient();

        function story(params: ContentDelivery.story.SearchParams) {
            return contentDelivery.story(params);
        }

        function stories(params: ContentDelivery.stories.SearchParams) {
            return contentDelivery.stories(params, { include: ['thumbnail_image'] });
        }

        function allStories(params?: ContentDelivery.allStories.SearchParams) {
            return contentDelivery.allStories(params, { include: ['thumbnail_image'] });
        }

        return {
            ...contentDelivery,
            locale,
            timezone: () => contentDelivery.newsroom().then((newsroom) => newsroom.timezone),
            story,
            stories,
            allStories,
            languageOrDefault(localeCode?: Locale.Code) {
                return contentDelivery.languageOrDefault(localeCode ?? locale());
            },
            translatedCategories(localeCode?: Locale.Code, categories?: Category[]) {
                return contentDelivery.translatedCategories(localeCode ?? locale(), categories);
            },
            themeSettings,
            notifications() {
                return contentDelivery.notifications(locale());
            },
            preload() {
                contentDelivery.languages();
                contentDelivery.themeSettings();
                contentDelivery.categories();
                contentDelivery.newsroom();
                contentDelivery.featuredContacts();
            },
        };
    },
});
