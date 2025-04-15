import { Component, Elements, Renderer } from '@prezly/content-renderer-react-js';
import type { Node } from '@prezly/story-content-format';
import { DocumentNode, HeadingNode, LinkNode, Text } from '@prezly/story-content-format';

import { Subtitle } from './Subtitle';

import styles from './HeaderRenderer.module.scss';

interface Props {
    nodes: Node | Node[];
}

export function HeaderRenderer({ nodes }: Props) {
    return (
        <div className={styles.renderer}>
            <Renderer nodes={nodes} defaultComponents={false} defaultFallback="ignore">
                <Component match={DocumentNode.isDocumentNode} component={Elements.Document} />
                <Component match={HeadingNode.isTitleHeadingNode} component={Elements.Heading} />
                <Component match={HeadingNode.isSubtitleHeadingNode} component={Subtitle} />
                <Component match={Text.isText} component={Elements.Text} />
                <Component match={LinkNode.isLinkNode} component={Elements.Passthru} />
            </Renderer>
        </div>
    );
}
