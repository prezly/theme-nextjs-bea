import { HeadingNode, TextAlignment } from '@prezly/story-content-format';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './styles.module.scss';

interface Props {
    node: HeadingNode;
    children?: ReactNode;
}

export function Heading({ node, children }: Props) {
    const className = classNames({
        [styles.headingOne]: node.type === HeadingNode.Type.HEADING_ONE,
        [styles.headingTwo]: node.type === HeadingNode.Type.HEADING_TWO,
        [styles.alignLeft]: node.align === TextAlignment.LEFT,
        [styles.alignCenter]: node.align === TextAlignment.CENTER,
        [styles.alignRight]: node.align === TextAlignment.RIGHT,
        [styles.alignJustify]: node.align === TextAlignment.JUSTIFY,
    });

    if (node.type === HeadingNode.Type.HEADING_ONE) {
        return <h2 className={className}>{children}</h2>;
    }

    return <h3 className={className}>{children}</h3>;
}
