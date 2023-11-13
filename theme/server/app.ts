import { api } from '@/theme/server/api';
import { getLocaleFromHeader } from '@/theme-kit/middleware';

export function app() {
    const { contentDelivery } = api();

    return {
        ...contentDelivery,
        locale: () => getLocaleFromHeader(),
        locales: () => contentDelivery.locales(),
        defaultLocale: () => contentDelivery.defaultLocale(),
        timezone: () => contentDelivery.newsroom().then((newsroom) => newsroom.timezone),
        dateFormat: () => contentDelivery.newsroom().then((newsroom) => newsroom.date_format),
        timeFormat: () => contentDelivery.newsroom().then((newsroom) => newsroom.time_format),
    };
}
