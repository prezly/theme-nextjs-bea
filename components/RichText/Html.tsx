import styles from '@/components/RichText/styles.module.scss';

export interface HtmlNode {
    type: 'html';
    content: string;
}

interface Props {
    node: HtmlNode;
}

export function Html({ node }: Props) {
    return (
        <div
            className={styles.htmlContent}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: node.content }}
        />
    );
}
