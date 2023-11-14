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

interface Props {
    children: ReactNode;
}

interface Entry {
    notifications: Notification[];
}

export function NotificationsRegistryProvider({ children }: Props) {
    const [entries, setEntries] = useState<Entry[]>([]);

    const register = useCallback(
        (notifications: Notification[]) => {
            const entry = { notifications };

            setEntries((es) => [...es, entry]);

            return () => setEntries((es) => es.filter((e) => e !== entry));
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

    return <context.Provider value={value}>{children}</context.Provider>;
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
