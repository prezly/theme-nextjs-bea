import { app } from '@/adapters/server';
import { NotificationsBar } from '@/components/NotificationsBar';

export async function Notifications() {
    const newsroomNotifications = await app().notifications(app().locale());

    return <NotificationsBar notifications={newsroomNotifications} />;
}
