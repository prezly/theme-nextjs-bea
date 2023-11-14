import { getNotifications } from '@prezly/theme-kit-core';

import { NotificationsBar } from '@/components/NotificationsBar';
import { app } from '@/theme/server';

export async function Notifications() {
    const languages = await app().languages();
    const notifications = getNotifications(languages, app().locale());

    return <NotificationsBar notifications={notifications} />;
}
