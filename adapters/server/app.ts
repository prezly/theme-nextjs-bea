import type { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { AppHelperAdapter } from '@prezly/theme-kit-nextjs/server';
import { headers } from 'next/headers';

import { api } from './api';
import { locale } from './locale';
import { themeSettings } from './theme-settings';

export const { useApp: app } = AppHelperAdapter.connect({
    identifyRequestContext: () => headers(),
    createAppHelper: () => {
        const { contentDelivery } = api();

        return {
            ...contentDelivery,
            locale,
            timezone: () => contentDelivery.newsroom().then((newsroom) => newsroom.timezone),
            dateFormat: () => contentDelivery.newsroom().then((newsroom) => newsroom.date_format),
            timeFormat: () => contentDelivery.newsroom().then((newsroom) => newsroom.time_format),
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
