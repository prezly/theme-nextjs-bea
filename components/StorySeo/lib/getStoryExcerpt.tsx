import { stringifyNode } from '@prezly/content-renderer-react-js';
import type { ExtendedStory } from '@prezly/sdk';
import { StoryFormatVersion } from '@prezly/sdk';
import type { Node } from '@prezly/slate-types';
import { isParagraphNode, isTextNode } from '@prezly/slate-types';

function isNodeEmpty(node: Node): boolean {
    if (isTextNode(node)) {
        return !node.text.length;
    }

    return !node.children.length || (node.children as Node[]).every(isNodeEmpty);
}

function getNodeTextLength(node: Node): number {
    if (isTextNode(node)) {
        return node.text.length;
    }

    return (node.children as Node[]).reduce(
        (total: number, child) => total + getNodeTextLength(child),
        0,
    );
}

const MAX_NODE_INDEX_FOR_TEXT_NODES = 5;
const MAX_TOTAL_TEXT_LENGTH = 300;

export function getStoryExcerpt(story: ExtendedStory): string {
    const { format_version, content } = story;

    // TODO: This needs testing
    if (format_version === StoryFormatVersion.HTML) {
        const dummy = document.createElement('div');
        dummy.innerHTML = content;

        const firstTextNode = Array.from(dummy.children).find((child) => !!child.textContent);

        return firstTextNode?.textContent || '';
    }

    const parsedContent = JSON.parse(content).children as Node[];
    const firstTextNodes: Node[] = [];

    // Find the earliest consecutive paragraph or text nodes to make excerpt from
    let textNodeIndex = parsedContent.findIndex(
        (node) => isParagraphNode(node) || isTextNode(node),
    );
    if (textNodeIndex === -1 || textNodeIndex > MAX_NODE_INDEX_FOR_TEXT_NODES) {
        return '';
    }

    let checkedNode = parsedContent[textNodeIndex];
    let totalTextLength = 0;
    while (
        textNodeIndex < parsedContent.length &&
        totalTextLength < MAX_TOTAL_TEXT_LENGTH &&
        checkedNode &&
        !isNodeEmpty(checkedNode) &&
        (isParagraphNode(checkedNode) || isTextNode(checkedNode))
    ) {
        firstTextNodes.push(checkedNode);
        totalTextLength += getNodeTextLength(checkedNode);
        textNodeIndex += 1;
        checkedNode = parsedContent[textNodeIndex];
    }

    if (!firstTextNodes.length) {
        return '';
    }

    return firstTextNodes.map(stringifyNode).join('\r\n');
}
