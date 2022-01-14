import { ComponentRenderers, Renderer } from '@prezly/content-renderer-react-js';
import {
    ATTACHMENT_NODE_TYPE,
    BULLETED_LIST_NODE_TYPE,
    CONTACT_NODE_TYPE,
    HEADING_1_NODE_TYPE,
    HEADING_2_NODE_TYPE,
    isTextNode,
    LINK_NODE_TYPE,
    LIST_ITEM_NODE_TYPE,
    LIST_ITEM_TEXT_NODE_TYPE,
    Node,
    NUMBERED_LIST_NODE_TYPE,
    PARAGRAPH_NODE_TYPE,
    QUOTE_NODE_TYPE,
} from '@prezly/slate-types';
import { FunctionComponent, useEffect, useMemo } from 'react';
import '@prezly/content-renderer-react-js/styles.css';

import Attachment from '@/components/Attachment';
import ContactCard from '@/components/ContactCard';
import Quote from '@/components/Quote';
import {
    Heading,
    Html,
    HtmlNode,
    Link,
    List,
    ListItem,
    ListItemText,
    Paragraph,
} from '@/components/RichText';

import styles from './SlateRenderer.module.scss';

interface Props {
    nodes: Node | Node[];
}

const components: ComponentRenderers = {
    [ATTACHMENT_NODE_TYPE]: ({ node }) => (
        <Attachment file={node.file} description={node.description} />
    ),

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
    [HEADING_1_NODE_TYPE]: Heading,
    [HEADING_2_NODE_TYPE]: Heading,
    [PARAGRAPH_NODE_TYPE]: Paragraph,
    [BULLETED_LIST_NODE_TYPE]: List,
    [NUMBERED_LIST_NODE_TYPE]: List,
    [LIST_ITEM_NODE_TYPE]: ListItem,
    [LIST_ITEM_TEXT_NODE_TYPE]: ListItemText,
    [LINK_NODE_TYPE]: Link,
    [QUOTE_NODE_TYPE]: Quote,
};

const SlateRenderer: FunctionComponent<Props> = ({ nodes }) => {
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
};

export default SlateRenderer;
