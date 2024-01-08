import { Elements } from '@prezly/content-renderer-react-js';
import type { HtmlNode } from '@prezly/story-content-format';

import styles from './styles.module.scss';

interface Props {
    node: HtmlNode;
}

export function Html({ node }: Props) {
    return <Elements.Html node={node} className={styles.htmlContent} />;
}
