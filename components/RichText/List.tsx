import { Alignment, ListNode } from '@prezly/story-content-format';
import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

import styles from './styles.module.scss';

interface Props {
    node: ListNode;
}

export function List({ node, children }: PropsWithChildren<Props>) {
    const className = classNames({
        [styles.numberedList]: node.type === ListNode.Type.NUMBERED,
        [styles.orderedList]: node.type === ListNode.Type.BULLETED,
        [styles.alignLeft]: node.align === Alignment.LEFT,
        [styles.alignCenter]: node.align === Alignment.CENTER,
        [styles.alignRight]: node.align === Alignment.RIGHT,
    });

    if (node.type === ListNode.Type.NUMBERED) {
        return <ol className={className}>{children}</ol>;
    }

    return <ul className={className}>{children}</ul>;
}

export function ListItem({ children }: PropsWithChildren<{}>) {
    return <li className={styles.listItem}>{children}</li>;
}

export function ListItemText({ children }: PropsWithChildren<{}>) {
    return <>{children}</>;
}
