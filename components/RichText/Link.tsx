import { LinkNode } from '@prezly/slate-types';
import { ReactNode } from 'react';

import styles from './styles.module.scss';

interface Props {
    node: LinkNode;
    children?: ReactNode;
}

export function Link({ node, children }: Props) {
    return (
        <a className={styles.link} href={node.href}>
            {children}
        </a>
    );
}
