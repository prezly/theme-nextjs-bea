import { app } from '@/adapters/server';

import * as ui from './ui';

export async function Notifications() {
    const newsroomNotifications = await app().notifications();

    return <ui.Notifications notifications={newsroomNotifications} />;
}
