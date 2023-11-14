'use client';

import type { Notification } from '@prezly/sdk';
import classNames from 'classnames';
import type { HTMLAttributes } from 'react';
import { useRef, useState } from 'react';

import { useOnResize } from './lib';
import { LinkedText } from './LinkedText';

import styles from './NotificationsBar.module.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
    notifications: Notification[];
}

function Notifications({ className, notifications, style, ...attributes }: Props) {
    const [topOffset, setTopOffset] = useState<number>();
    const container = useRef<HTMLDivElement>(null);

    useOnResize(() => {
        setTopOffset(container.current?.getBoundingClientRect().top);
    });

    return (
        <div
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...attributes}
            className={classNames(styles.container, className)}
            ref={container}
            style={{ ...style, top: topOffset }}
        >
            {notifications.map(({ id, title, description, actions, style: notificationStyle }) => (
                <p
                    className={classNames(styles.notification, {
                        [styles.success]: notificationStyle === 'success',
                        [styles.info]: notificationStyle === 'info',
                        [styles.danger]: notificationStyle === 'danger',
                        [styles.warning]: notificationStyle === 'warning',
                    })}
                    key={id}
                >
                    <LinkedText links={actions}>{`${title} ${description}`}</LinkedText>
                </p>
            ))}
        </div>
    );
}

export function NotificationsBar({ notifications, ...props }: Props) {
    if (notifications.length === 0) {
        return null;
    }

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Notifications {...props} notifications={notifications} />;
}
