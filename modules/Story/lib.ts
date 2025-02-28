import { Alignment, HeadingNode } from '@prezly/story-content-format';

export function getHeaderAlignment(
    nodes: { children: HeadingNode[] } | HeadingNode[],
): `${Alignment}` | undefined {
    const headingNodes = Array.isArray(nodes) ? nodes : nodes.children;

    const titleNode: HeadingNode | undefined = headingNodes.find((node) =>
        HeadingNode.isTitleHeadingNode(node),
    );
    const subtitleNode: HeadingNode | undefined = headingNodes.find((node) =>
        HeadingNode.isSubtitleHeadingNode(node),
    );

    if (subtitleNode && subtitleNode.align) {
        return subtitleNode.align;
    }

    return titleNode?.align ?? Alignment.LEFT;
}
