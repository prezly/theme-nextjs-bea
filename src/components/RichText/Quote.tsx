import { TextAlignment } from '@prezly/story-content-format';
import type { QuoteNode } from '@prezly/story-content-format';
import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

import styles from './Quote.module.scss';

interface Props {
    node: QuoteNode;
}

export function Quote({ node, children }: PropsWithChildren<Props>) {
    const alignment = node.align ?? TextAlignment.LEFT;

    return (
        <blockquote
            className={classNames(styles.container, {
                [styles.alignLeft]: alignment === TextAlignment.LEFT,
                [styles.alignCenter]: alignment === TextAlignment.CENTER,
                [styles.alignRight]: alignment === TextAlignment.RIGHT,
                [styles.alignJustify]: alignment === TextAlignment.JUSTIFY,
            })}
        >
            <div className={styles.content}>{children}</div>
        </blockquote>
    );
}
