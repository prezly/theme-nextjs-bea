import { stringifyNode } from '@prezly/content-renderer-react-js';
import type { Node } from '@prezly/story-content-format';

import slugify from '@/utils/slugify';

export function slugifyNodeText(node: Node): string {
    return <string>slugify(stringifyNode(node));
}
