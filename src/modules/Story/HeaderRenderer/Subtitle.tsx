import { stringifyNode } from '@prezly/content-renderer-react-js';
import type { HeadingNode } from '@prezly/story-content-format';
import { TextAlignment } from '@prezly/story-content-format';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './Subtitle.module.scss';

interface Props {
    children?: ReactNode;
    node: HeadingNode;
}

export function Subtitle({ children, node }: Props) {
    const text = stringifyNode(node).trim();
    if (text.length === 0) {
        return null;
    }

    return (
        <p
            className={classNames(styles.subtitle, {
                [styles.alignLeft]: node.align === TextAlignment.LEFT,
                [styles.alignCenter]: node.align === TextAlignment.CENTER,
                [styles.alignRight]: node.align === TextAlignment.RIGHT,
            })}
        >
            {children}
        </p>
    );
}
