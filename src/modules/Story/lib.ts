import { HeadingNode, TextAlignment } from '@prezly/story-content-format';

export function getHeaderAlignment(
    nodes: { children: HeadingNode[] } | HeadingNode[],
): `${TextAlignment}` | undefined {
    const headingNodes = Array.isArray(nodes) ? nodes : nodes.children;

    const titleNode: HeadingNode | undefined = headingNodes.find((node) =>
        HeadingNode.isTitleHeadingNode(node),
    );
    const subtitleNode: HeadingNode | undefined = headingNodes.find((node) =>
        HeadingNode.isSubtitleHeadingNode(node),
    );

    return subtitleNode?.align ?? titleNode?.align ?? TextAlignment.LEFT;
}
