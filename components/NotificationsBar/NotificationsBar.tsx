'use client';

import type { Notification } from '@prezly/sdk';
import classNames from 'classnames';
import type { HTMLAttributes } from 'react';

import { LinkedText } from './LinkedText';

import styles from './NotificationsBar.module.scss';

export function NotificationsBar({
    className,
    notifications,
    ...attributes
}: NotificationsBar.Props) {
    if (notifications.length === 0) {
        return null;
    }

    return (
        <div {...attributes} className={classNames(styles.container, className)}>
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

export namespace NotificationsBar {
    export interface Props extends HTMLAttributes<HTMLDivElement> {
        notifications: Notification[];
    }
}
