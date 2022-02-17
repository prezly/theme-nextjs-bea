import { Html as HtmlRenderer } from '@prezly/content-renderer-react-js';
import { type HtmlNode } from '@prezly/slate-types';

import styles from './styles.module.scss';

interface Props {
    node: HtmlNode;
}

export function Html({ node }: Props) {
    return <HtmlRenderer node={node} className={styles.htmlContent} />;
}
