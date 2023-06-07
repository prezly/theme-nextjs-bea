import type { HeadingNode } from '@prezly/story-content-format';
import { Alignment } from '@prezly/story-content-format';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './Subtitle.module.scss';

interface Props {
    children?: ReactNode;
    node: HeadingNode;
}

export function Subtitle({ children, node }: Props) {
    return (
        <p
            className={classNames(styles.subtitle, {
                [styles.alignLeft]: node.align === Alignment.LEFT,
                [styles.alignCenter]: node.align === Alignment.CENTER,
                [styles.alignRight]: node.align === Alignment.RIGHT,
            })}
        >
            {children}
        </p>
    );
}
