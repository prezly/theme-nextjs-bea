import { Options, Renderer } from '@prezly/slate-renderer';
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
import '@prezly/slate-renderer/build/styles.css';

import Attachment from '@/components/Attachment';
import ContactCard from '@/components/ContactCard';
import Quote from '@/components/Quote';

import styles from './SlateRenderer.module.scss';

interface Props {
    nodes: Node | Node[];
}

const options: Options = {
    [ATTACHMENT_NODE_TYPE]: ({ node }) => (
        <Attachment file={node.file} description={node.description} />
    ),
    [BULLETED_LIST_NODE_TYPE]: ({ children }) => (
        <ul className={styles.bulletedList}>{children}</ul>
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
    [HEADING_1_NODE_TYPE]: ({ children }) => <h2 className={styles.headingOne}>{children}</h2>,
    [HEADING_2_NODE_TYPE]: ({ children }) => <h3 className={styles.headingTwo}>{children}</h3>,
    [LINK_NODE_TYPE]: ({ children, node }) => (
        <a href={node.href} className={styles.link}>
            {children}
        </a>
    ),
    [LIST_ITEM_NODE_TYPE]: ({ children }) => <li className={styles.listItem}>{children}</li>,
    [LIST_ITEM_TEXT_NODE_TYPE]: ({ children }) => <>{children}</>,
    [NUMBERED_LIST_NODE_TYPE]: ({ children }) => (
        <ol className={styles.numberedList}>{children}</ol>
    ),
    [PARAGRAPH_NODE_TYPE]: ({ children }) => <p className={styles.paragraph}>{children}</p>,
    [QUOTE_NODE_TYPE]: ({ children }) => <Quote>{children}</Quote>,
};

const SlateRenderer: FunctionComponent<Props> = ({ nodes }) => {
    useEffect(() => {
        document.body.classList.add(styles.body);

        return () => {
            document.body.classList.remove(styles.body);
        };
    }, []);

    // TODO: Remove this when slate-renderer adds support for html nodes
    const htmlNodes = useMemo(() => {
        if (Array.isArray(nodes) || isTextNode(nodes)) {
            return [];
        }

        return nodes.children.filter((child: any) => !isTextNode(child) && child.type === 'html');
    }, [nodes]);

    return (
        <div className={styles.renderer}>
            {/* TODO: Remove this when slate-renderer adds support for html nodes */}
            {htmlNodes.map((node: any, index) => (
                <div
                    className={styles.htmlContent}
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: node.content }}
                />
            ))}
            <Renderer nodes={nodes} options={options} />
        </div>
    );
};

export default SlateRenderer;
