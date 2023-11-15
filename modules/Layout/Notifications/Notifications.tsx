import { NotificationsBar } from '@/components/NotificationsBar';
import { app } from '@/theme/server';

export async function Notifications() {
    const newsroomNotifications = await app().notifications(app().locale());

    return <NotificationsBar notifications={newsroomNotifications} />;
}
