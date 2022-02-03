import type { ComponentRenderers } from '@prezly/content-renderer-react-js';
import { Renderer } from '@prezly/content-renderer-react-js';
import type { Node } from '@prezly/slate-types';
import {
    ATTACHMENT_NODE_TYPE,
    BULLETED_LIST_NODE_TYPE,
    CONTACT_NODE_TYPE,
    GALLERY_NODE_TYPE,
    HEADING_1_NODE_TYPE,
    HEADING_2_NODE_TYPE,
    IMAGE_NODE_TYPE,
    isTextNode,
    LINK_NODE_TYPE,
    LIST_ITEM_NODE_TYPE,
    LIST_ITEM_TEXT_NODE_TYPE,
    NUMBERED_LIST_NODE_TYPE,
    PARAGRAPH_NODE_TYPE,
    QUOTE_NODE_TYPE,
} from '@prezly/slate-types';
import { useEffect, useMemo } from 'react';
import '@prezly/content-renderer-react-js/styles.css';

import { ContactCard } from '@/components';
import type { HtmlNode } from '@/components/RichText';
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

import { Attachment, Gallery, Image } from './components';

import styles from './SlateRenderer.module.scss';

interface Props {
    nodes: Node | Node[];
}

const components: ComponentRenderers = {
    [ATTACHMENT_NODE_TYPE]: Attachment,
    [CONTACT_NODE_TYPE]: ({ node: { contact } }) => (
        <ContactCard
            className={styles.contactCard}
            contact={contact}
            renderAvatar={({ className }) =>
                contact.avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={className} src={contact.avatar_url} alt={contact.name} />
                )
            }
        />
    ),
    [BULLETED_LIST_NODE_TYPE]: List,
    [GALLERY_NODE_TYPE]: Gallery,
    [HEADING_1_NODE_TYPE]: Heading,
    [HEADING_2_NODE_TYPE]: Heading,
    [IMAGE_NODE_TYPE]: Image,
    [LINK_NODE_TYPE]: Link,
    [LIST_ITEM_NODE_TYPE]: ListItem,
    [LIST_ITEM_TEXT_NODE_TYPE]: ListItemText,
    [NUMBERED_LIST_NODE_TYPE]: List,
    [PARAGRAPH_NODE_TYPE]: Paragraph,
    [QUOTE_NODE_TYPE]: Quote,
};

function SlateRenderer({ nodes }: Props) {
    useEffect(() => {
        document.body.classList.add(styles.body);

        return () => {
            document.body.classList.remove(styles.body);
        };
    }, []);

    // TODO: Remove this when content-renderer-react-js adds support for html nodes
    const htmlNodes = useMemo(() => {
        if (Array.isArray(nodes) || isTextNode(nodes)) {
            return [];
        }

        return nodes.children.filter((child: any) => !isTextNode(child) && child.type === 'html');
    }, [nodes]);

    return (
        <div className={styles.renderer}>
            {/* TODO: Remove this when content-renderer-react-js adds support for html nodes. @see MT-4553 */}
            {htmlNodes.map((node: any, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Html node={node as HtmlNode} key={index} />
            ))}
            <Renderer nodes={nodes} components={components} />
        </div>
    );
}

export default SlateRenderer;
