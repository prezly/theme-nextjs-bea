'use client';

import { useMemo } from 'react';

import { NotificationsBar } from '@/components/NotificationsBar';
import { useBroadcastedNotifications } from '@/modules/Broadcast';

export function Notifications({ notifications, ...props }: NotificationsBar.Props) {
    const broadcastedNotifications = useBroadcastedNotifications();

    const displayedNotifications = useMemo(
        () => [...notifications, ...broadcastedNotifications],
        [notifications, broadcastedNotifications],
    );

    return <NotificationsBar {...props} notifications={displayedNotifications} />;
}
