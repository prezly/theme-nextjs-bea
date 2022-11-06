import { Component, Renderer } from '@prezly/content-renderer-react-js';
import type { Node } from '@prezly/story-content-format';
import { GalleryNode, HeadingNode, ImageNode, ParagraphNode } from '@prezly/story-content-format';

import { Heading } from '@/components/RichText';
import { OverwrittenParagraph } from '@/components/SlateRenderer/components/OverwrittenParagraph';

import { RssGallery, RssImage } from './components';

interface Props {
    nodes: Node | Node[];
}

export function SlateFeedRenderer({ nodes }: Props) {
    return (
        <Renderer nodes={nodes} defaultComponents>
            {/* <Component match={AttachmentNode.isAttachmentNode} component={NoRender} /> */}
            {/* <Component match={ContactNode.isContactNode} component={ContactCard} /> */}
            <Component match={GalleryNode.isGalleryNode} component={RssGallery} />
            <Component match={HeadingNode.isHeadingNode} component={Heading} />
            {/* <Component match={HtmlNode.isHtmlNode} component={Html} /> */}
            <Component match={ImageNode.isImageNode} component={RssImage} />
            {/* <Component match={LinkNode.isLinkNode} component={Link} /> */}
            {/* <Component match={ListNode.isListNode} component={List} /> */}
            {/* <Component match={ListItemNode.isListItemNode} component={ListItem} /> */}
            {/* <Component match={ListItemTextNode.isListItemTextNode} component={ListItemText} /> */}
            <Component match={ParagraphNode.isParagraphNode} component={OverwrittenParagraph} />
            {/* <Component match={QuoteNode.isQuoteNode} component={Quote} /> */}
            {/* <Component match={StoryBookmarkNode.isStoryBookmarkNode} component={StoryBookmark} /> */}
        </Renderer>
    );
}
