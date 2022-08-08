import React, { ReactElement } from 'react';
import { Notification } from '@prezly/sdk';

import styles from './Notifications.module.scss';
import classNames from 'classnames';

interface Props {
    notifications: Notification[];
}

export default function Notifications({ notifications }: Props) {
    if (notifications.length === 0) {
        return null;
    }
    return (
        <div className={classNames(styles.notifications)}>
            <div className={styles.content}>
                {notifications.map(({ title, description, actions }) =>
                    linkActions(`${title} ${description} `, actions),
                )}
            </div>
        </div>
    );
}

/**
 * Replace text marked with "[...]" with the anchor elements.
 *
 * Example:
 *
 *   description: "Visit [our website] to start using the most awesome PR software"
 *   actions:     { name: "our website", target: "https://www.prezly.com/" }
 *
 * Result:
 *
 *   Visit <a href="https://www.prezly.com/">our website</a> to start using the most awesome PR software.
 *
 */
function linkActions(text: string, actions: Notification['actions']) {
    let ret: (ReactElement | string)[] = [text];
    for (const { target, name } of actions) {
        ret = ret.flatMap((part) => {
            const replace = `[${name}]`;
            if (typeof part !== 'string' || !part.includes(replace)) {
                return part;
            }
            return part.split(replace).flatMap((value, index) => {
                if (index === 0) return [value];
                return [
                    <a href={target} target="_blank">
                        {name}
                    </a>,
                    value,
                ];
            });
        });
    }
    return ret;
}
