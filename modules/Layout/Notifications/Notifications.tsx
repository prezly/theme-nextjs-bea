import { Notification } from '@prezly/sdk';
import { getNotifications } from '@prezly/theme-kit-core';

import { NotificationsBar } from '@/components/NotificationsBar';
import { app } from '@/theme/server';

const PREVIEW_WARNING: Notification = {
    id: 'preview-warning',
    type: 'preview-warning',
    style: Notification.Style.WARNING,
    title: 'This is a preview with a temporary URL which will change after publishing.',
    description: '',
    actions: [],
};

interface Props {
    isPreviewUrl: boolean;
}

export async function Notifications({ isPreviewUrl }: Props) {
    const languages = await app().languages();
    const notifications = getNotifications(languages, app().locale());

    if (isPreviewUrl) {
        return <NotificationsBar notifications={[...notifications, PREVIEW_WARNING]} />;
    }

    return <NotificationsBar notifications={notifications} />;
}
