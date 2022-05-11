import type { QuoteNode } from '@prezly/story-content-format';
import { Alignment } from '@prezly/slate-types';
import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

import styles from './Quote.module.scss';

interface Props {
    node: QuoteNode;
}

export function Quote({ node, children }: PropsWithChildren<Props>) {
    const alignment = node.align ?? Alignment.LEFT;

    return (
        <blockquote className={styles.container}>
            <div
                className={classNames(styles.content, {
                    [styles.alignLeft]: alignment === Alignment.LEFT,
                    [styles.alignCenter]: alignment === Alignment.CENTER,
                    [styles.alignRight]: alignment === Alignment.RIGHT,
                })}
            >
                {children}
            </div>
        </blockquote>
    );
}
