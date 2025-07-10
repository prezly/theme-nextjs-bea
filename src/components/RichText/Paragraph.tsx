import { TextAlignment } from '@prezly/story-content-format';
import type { ParagraphNode } from '@prezly/story-content-format';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './styles.module.scss';

interface Props {
    node: ParagraphNode;
    children?: ReactNode;
}

export function Paragraph({ node, children }: Props) {
    return (
        <p
            className={classNames(styles.paragraph, {
                [styles.alignLeft]: node.align === TextAlignment.LEFT,
                [styles.alignCenter]: node.align === TextAlignment.CENTER,
                [styles.alignRight]: node.align === TextAlignment.RIGHT,
                [styles.alignJustify]: node.align === TextAlignment.JUSTIFY,
            })}
        >
            {children}
        </p>
    );
}
