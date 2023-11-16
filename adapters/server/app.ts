/* eslint-disable @typescript-eslint/no-use-before-define */
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
            translatedCategories(localeCode?: Locale.Code, categories?: Category[]) {
                return contentDelivery.translatedCategories(localeCode ?? locale(), categories);
            },
            themeSettings,
            notifications() {
                return contentDelivery.notifications(locale());
            },
        };
    },
});
