'use client';

import type { Notification } from '@prezly/sdk';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Revoke = () => void;

interface Context {
    notifications: Notification[];
    broadcast: (notifications: Notification[]) => Revoke;
}

const context = createContext<Context>({
    notifications: [],
    broadcast() {
        throw new Error(
            'This functionality requires `BroadcastNotificationsProvider` mounted up the components tree.',
        );
    },
});

interface Entry {
    notifications: Notification[];
}

export function BroadcastNotificationsProvider(props: { children: ReactNode }) {
    const [entries, setEntries] = useState<Entry[]>([]);

    const broadcast = useCallback(
        (notifications: Notification[]) => {
            const entry = { notifications };

            setEntries((prev) => [...prev, entry]);

            return () => setEntries((prev) => prev.filter((existing) => existing !== entry));
        },
        [setEntries],
    );

    const value = useMemo(
        () => ({
            notifications: entries.reduce<Notification[]>(
                (agg, entry) => [...agg, ...entry.notifications],
                [],
            ),
            broadcast,
        }),
        [entries, broadcast],
    );

    return <context.Provider value={value}>{props.children}</context.Provider>;
}

export function BroadcastNotifications(props: { notifications: Notification[] }) {
    useBroadcastNotifications(props.notifications);

    return null;
}

export function useBroadcastNotifications(notifications: Notification[]) {
    const { broadcast } = useContext(context);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => broadcast(notifications), [JSON.stringify(notifications)]);
}

export function useBroadcastedNotifications(): Notification[] {
    return useContext(context).notifications;
}
