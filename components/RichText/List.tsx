import { Alignment, ListNode } from '@prezly/story-content-format';
import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

import styles from './styles.module.scss';

interface Props {
    node: ListNode;
}

export function List({ node, children }: PropsWithChildren<Props>) {
    const Tag = node.type === ListNode.Type.NUMBERED ? 'ol' : 'ul';

    return (
        <div
            className={classNames(styles.listContainer, {
                [styles.alignLeft]: node.align === Alignment.LEFT,
                [styles.alignCenter]: node.align === Alignment.CENTER,
                [styles.alignRight]: node.align === Alignment.RIGHT,
            })}
        >
            <Tag
                className={classNames({
                    [styles.bulletedList]: node.type === ListNode.Type.BULLETED,
                    [styles.numberedList]: node.type === ListNode.Type.NUMBERED,
                })}
            >
                {children}
            </Tag>
        </div>
    );
}

export function ListItem({ children }: PropsWithChildren<{}>) {
    return <li className={styles.listItem}>{children}</li>;
}

export function ListItemText({ children }: PropsWithChildren<{}>) {
    return <>{children}</>;
}
