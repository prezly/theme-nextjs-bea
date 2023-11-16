'use client';

import { useMemo } from 'react';

import { NotificationsBar } from '@/components/NotificationsBar';
import { useBroadcastedNotifications } from '@/modules/BroadcastNotifications';

export function Notifications({ notifications, ...props }: NotificationsBar.Props) {
    const broadcastedNotifications = useBroadcastedNotifications();

    const displayedNotifications = useMemo(
        () => [...notifications, ...broadcastedNotifications],
        [notifications, broadcastedNotifications],
    );

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <NotificationsBar {...props} notifications={displayedNotifications} />;
}
