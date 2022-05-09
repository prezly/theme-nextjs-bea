import type { QuoteNode } from '@prezly/slate-types';
import { Alignment } from '@prezly/slate-types';
import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

import styles from './Quote.module.scss';

interface Props {
    node: QuoteNode;
}

export function Quote({ node, children }: PropsWithChildren<Props>) {
    const alignment = node.align ?? Alignment.RIGHT;

    return (
        <blockquote
            className={classNames(styles.container, {
                left: alignment === Alignment.LEFT,
                right: alignment === Alignment.RIGHT,
                center: alignment === Alignment.CENTER,
            })}
        >
            {(alignment === Alignment.LEFT || alignment === Alignment.CENTER) && (
                <div className={styles.left} aria-hidden="true" />
            )}
            <div
                className={classNames(styles.content, {
                    [styles.alignLeft]: alignment === Alignment.LEFT,
                    [styles.alignCenter]: alignment === Alignment.CENTER,
                    [styles.alignRight]: alignment === Alignment.RIGHT,
                })}
            >
                {children}
            </div>
            {alignment === Alignment.RIGHT && <div className={styles.right} aria-hidden="true" />}
        </blockquote>
    );
}
