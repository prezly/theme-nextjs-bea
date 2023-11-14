/* eslint-disable @typescript-eslint/no-use-before-define */

'use client';

import type { Notification } from '@prezly/sdk';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Unregister = () => void;

interface Context {
    notifications: Notification[];
    register: (notifications: Notification[]) => Unregister;
}

const context = createContext<Context>({
    notifications: [],
    register() {
        throw new Error(
            'This functionality requires `NotificationsContextProvider` mounted up the components tree.',
        );
    },
});

interface Entry {
    notifications: Notification[];
}

export function NotificationsRegistryProvider(props: { children: ReactNode }) {
    const [entries, setEntries] = useState<Entry[]>([]);

    const register = useCallback(
        (notifications: Notification[]) => {
            const entry = { notifications };

            setEntries((prev) => [...prev, entry]);

            return () => setEntries((prev) => prev.filter((existing) => existing !== entry));
        },
        [setEntries],
    );

    const value = useMemo(
        () => ({
            notifications: entries.flatMap((entry) => entry.notifications),
            register,
        }),
        [entries, register],
    );

    return <context.Provider value={value}>{props.children}</context.Provider>;
}

export function RegisterNotifications(props: { notifications: Notification[] }) {
    useRegisterNotifications(props.notifications);

    return null;
}

export function useRegisterNotifications(notifications: Notification[]) {
    const { register } = useContext(context);

    useEffect(() => register(notifications), [notifications]);
}

export function useRegisteredNotifications(): Notification[] {
    const { notifications } = useContext(context);
    return notifications;
}
