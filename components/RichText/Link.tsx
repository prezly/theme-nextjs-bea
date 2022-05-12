import { STORY_LINK, useAnalytics } from '@prezly/analytics-nextjs';
import type { LinkNode } from '@prezly/story-content-format';
import type { ReactNode } from 'react';

import styles from './styles.module.scss';

interface Props {
    node: LinkNode;
    children?: ReactNode;
}

export function Link({ node, children }: Props) {
    const { track } = useAnalytics();
    const { href } = node;

    function handleClick() {
        track(STORY_LINK.CLICK, { href });
    }

    return (
        <a
            className={styles.link}
            href={href}
            onClick={handleClick}
            rel="noopener noreferrer"
            target={node.new_tab ? '_blank' : '_self'}
        >
            {children}
        </a>
    );
}
