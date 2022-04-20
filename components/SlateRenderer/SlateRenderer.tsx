import { Component, Renderer } from '@prezly/content-renderer-react-js';
import type { Node } from '@prezly/slate-types';
import {
    isAttachmentNode,
    isContactNode,
    isGalleryNode,
    isHeadingNode,
    isHtmlNode,
    isImageNode,
    isLinkNode,
    isListItemNode,
    isListItemTextNode,
    isListNode,
    isParagraphNode,
    isPlaceholderNode,
    isQuoteNode,
} from '@prezly/slate-types';
import { useEffect } from 'react';
import '@prezly/content-renderer-react-js/styles.css';

import {
    Heading,
    Html,
    Link,
    List,
    ListItem,
    ListItemText,
    Paragraph,
    Quote,
} from '@/components/RichText';

import { Attachment, ContactCard, Gallery, Image, Placeholder } from './components';

import styles from './SlateRenderer.module.scss';

interface Props {
    nodes: Node | Node[];
}

function SlateRenderer({ nodes }: Props) {
    useEffect(() => {
        document.body.classList.add(styles.body);

        return () => {
            document.body.classList.remove(styles.body);
        };
    }, []);

    return (
        <div className={styles.renderer}>
            <Renderer nodes={nodes}>
                <Component match={isAttachmentNode} component={Attachment} />
                <Component match={isContactNode} component={ContactCard} />
                <Component match={isGalleryNode} component={Gallery} />
                <Component match={isHeadingNode} component={Heading} />
                <Component match={isHtmlNode} component={Html} />
                <Component match={isImageNode} component={Image} />
                <Component match={isLinkNode} component={Link} />
                <Component match={isListNode} component={List} />
                <Component match={isListItemNode} component={ListItem} />
                <Component match={isListItemTextNode} component={ListItemText} />
                <Component match={isParagraphNode} component={Paragraph} />
                <Component match={isPlaceholderNode} component={Placeholder} />
                <Component match={isQuoteNode} component={Quote} />
            </Renderer>
        </div>
    );
}

export default SlateRenderer;
