import type { QuoteNode } from '@prezly/slate-types';
import { Alignment } from '@prezly/slate-types';
import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

import { IconQuoteClosing, IconQuoteOpening } from '@/icons';

import styles from './Quote.module.scss';

interface Props {
    node: QuoteNode;
}

export function Quote({ node, children }: PropsWithChildren<Props>) {
    return (
        <blockquote className={styles.container}>
            <div className={styles.left} aria-hidden="true">
                <IconQuoteOpening className={styles.quote} />
                <IconQuoteOpening className={styles.quote} />
            </div>
            <div
                className={classNames(styles.content, {
                    [styles.alignLeft]: node.align === Alignment.LEFT,
                    [styles.alignCenter]: node.align === Alignment.CENTER,
                    [styles.alignRight]: node.align === Alignment.RIGHT,
                })}
            >
                {children}
            </div>
            <div className={styles.right} aria-hidden="true">
                <IconQuoteClosing className={styles.quote} />
                <IconQuoteClosing className={styles.quote} />
            </div>
        </blockquote>
    );
}
