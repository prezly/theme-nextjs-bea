import { Alignment, HeadingNode } from '@prezly/story-content-format';

export function getHeaderAlignment(
    nodes: { children: HeadingNode[] } | HeadingNode[],
): `${Alignment}` | undefined {
    const headingNodes = Array.isArray(nodes) ? nodes : nodes.children;

    const titleNode = headingNodes.find((node) => HeadingNode.isTitleHeadingNode(node));
    const subtitleNode = headingNodes.find((node) => HeadingNode.isSubtitleHeadingNode(node));

    if (subtitleNode && subtitleNode.align) {
        return subtitleNode.align;
    }

    return titleNode?.align ?? Alignment.LEFT;
}
