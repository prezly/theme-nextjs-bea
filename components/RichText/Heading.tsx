import { Alignment, HEADING_1_NODE_TYPE, HEADING_2_NODE_TYPE } from '@prezly/slate-types';
import type { HeadingNode } from '@prezly/story-content-format';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './styles.module.scss';

interface Props {
    node: HeadingNode;
    children?: ReactNode;
}

export function Heading({ node, children }: Props) {
    const className = classNames({
        [styles.headingOne]: node.type === HEADING_1_NODE_TYPE,
        [styles.headingTwo]: node.type === HEADING_2_NODE_TYPE,
        [styles.alignLeft]: node.align === Alignment.LEFT,
        [styles.alignCenter]: node.align === Alignment.CENTER,
        [styles.alignRight]: node.align === Alignment.RIGHT,
    });

    if (node.type === HEADING_1_NODE_TYPE) {
        return <h2 className={className}>{children}</h2>;
    }

    return <h3 className={className}>{children}</h3>;
}
