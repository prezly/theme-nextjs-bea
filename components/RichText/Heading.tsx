import { Alignment, HeadingNode } from '@prezly/story-content-format';
import classNames from 'clsx';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

import { slugifyNodeText } from '@/utils/slugifyNodeText';

import styles from './styles.module.scss';

interface Props {
    node: HeadingNode;
    children?: ReactNode;
}

export function Heading({ node, children }: Props) {
    // When components are server side rendered from nextjs /api `useRouter` is unavailable
    // Currently it is a case for algolia indexation webhooks
    // That's a reason why we need to render share icon link conditionally
    const router = useRouter();
    const id = slugifyNodeText(node);

    const className = classNames(styles.heading, {
        [styles.headingOne]: node.type === HeadingNode.Type.HEADING_ONE,
        [styles.headingTwo]: node.type === HeadingNode.Type.HEADING_TWO,
        [styles.alignLeft]: node.align === Alignment.LEFT,
        [styles.alignCenter]: node.align === Alignment.CENTER,
        [styles.alignRight]: node.align === Alignment.RIGHT,
    });

    if (node.type === HeadingNode.Type.HEADING_ONE) {
        return (
            <h2 className={className} id={id}>
                {children}
                {router && (
                    <a href={`${router.asPath}#${id}`} className={styles.anchor}>
                        <span className={styles.icon}>🔗</span>
                    </a>
                )}
            </h2>
        );
    }

    return (
        <h3 className={className} id={id}>
            {router && (
                <a href={`${router.asPath}#${id}`} className={styles.anchor}>
                    <span className={styles.icon}>🔗</span>
                </a>
            )}
            {children}
        </h3>
    );
}
