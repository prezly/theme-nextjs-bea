import { Component, Elements, Renderer } from '@prezly/content-renderer-react-js';
import type { Node } from '@prezly/story-content-format';
import { ImageNode } from '@prezly/story-content-format';

import styles from './HeaderImageRenderer.module.scss';

interface Props {
    nodes: Node | Node[];
}

export function HeaderImageRenderer({ nodes }: Props) {
    return (
        <div className={styles.renderer}>
            <Renderer nodes={nodes} defaultFallback="ignore">
                <Component match={ImageNode.isImageNode} component={Elements.Image} />
            </Renderer>
        </div>
    );
}
