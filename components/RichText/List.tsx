import type { ListNode } from '@prezly/story-content-format';
import { Alignment, BULLETED_LIST_NODE_TYPE, NUMBERED_LIST_NODE_TYPE } from '@prezly/slate-types';
import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

import styles from './styles.module.scss';

interface Props {
    node: ListNode;
}

export function List({ node, children }: PropsWithChildren<Props>) {
    const className = classNames({
        [styles.numberedList]: node.type === NUMBERED_LIST_NODE_TYPE,
        [styles.orderedList]: node.type === BULLETED_LIST_NODE_TYPE,
        [styles.alignLeft]: node.align === Alignment.LEFT,
        [styles.alignCenter]: node.align === Alignment.CENTER,
        [styles.alignRight]: node.align === Alignment.RIGHT,
    });

    if (node.type === NUMBERED_LIST_NODE_TYPE) {
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
