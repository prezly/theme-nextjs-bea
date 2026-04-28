import { HeadingNode, TextAlignment } from '@prezly/story-content-format';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { slugifyHeading } from '@/utils';

import styles from './styles.module.scss';

interface Props {
    node: HeadingNode;
    children?: ReactNode;
}

function extractText(children: HeadingNode['children']): string {
    return children
        .map((child) => ('text' in child ? child.text : extractText((child as any).children ?? [])))
        .join('');
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

    const id = slugifyHeading(extractText(node.children));

    if (node.type === HeadingNode.Type.HEADING_ONE) {
        return (
            <h3 id={id} className={className}>
                {children}
            </h3>
        );
    }

    return (
        <h4 id={id} className={className}>
            {children}
        </h4>
    );
}
