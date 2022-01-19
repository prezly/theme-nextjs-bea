import { LinkNode } from '@prezly/slate-types';
import { ReactNode } from 'react';

import { STORY_LINK, useAnalytics } from '@/modules/analytics';

import styles from './styles.module.scss';

interface Props {
    node: LinkNode;
    children?: ReactNode;
}

export function Link({ node, children }: Props) {
    const { track } = useAnalytics();
    const { href } = node;

    const handleClick = () => {
        track(STORY_LINK.CLICK, { href });
    };

    return (
        <a className={styles.link} href={href} onClick={handleClick}>
            {children}
        </a>
    );
}
