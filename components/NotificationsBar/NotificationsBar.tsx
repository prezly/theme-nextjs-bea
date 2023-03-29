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
    const [height, setHeight] = useState<number>();
    const container = useRef<HTMLDivElement>(null);
    const banner = useRef<HTMLDivElement>(null);

    useOnResize(() => {
        setHeight(banner.current?.getBoundingClientRect().height);
    });

    return (
        <div
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...attributes}
            className={classNames(styles.container, className)}
            ref={container}
            style={{ ...style, height }}
        >
            <div className={styles.banner} ref={banner}>
                <div className={styles.content}>
                    {notifications.map(({ id, title, description, actions }) => (
                        <LinkedText key={id} links={actions}>
                            {`${title} ${description}`}
                        </LinkedText>
                    ))}
                </div>
            </div>
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
