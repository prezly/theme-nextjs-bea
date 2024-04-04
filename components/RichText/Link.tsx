import type { LinkNode } from '@prezly/story-content-format';
import type { ReactNode } from 'react';

import styles from './styles.module.scss';

interface Props {
    node: LinkNode;
    children?: ReactNode;
}

export function Link({ node, children }: Props) {
    const { href } = node;

    return (
        <a
            className={styles.link}
            href={href}
            rel="noopener noreferrer"
            target={node.new_tab ? '_blank' : '_self'}
        >
            {children}
        </a>
    );
}
