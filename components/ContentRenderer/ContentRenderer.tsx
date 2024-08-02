import { Component, Elements, Renderer } from '@prezly/content-renderer-react-js';
import type { ExtendedStory } from '@prezly/sdk';
import type { Node } from '@prezly/story-content-format';
import {
    AttachmentNode,
    ButtonBlockNode,
    EmbedNode,
    GalleryNode,
    HeadingNode,
    HtmlNode,
    ImageNode,
    LinkNode,
    ListItemNode,
    ListItemTextNode,
    ListNode,
    ParagraphNode,
    QuoteNode,
    StoryBookmarkNode,
    VariableNode,
    VideoNode,
} from '@prezly/story-content-format';
import { FormattedDate } from '@prezly/theme-kit-nextjs';

import {
    Heading,
    Html,
    Link,
    List,
    ListItem,
    ListItemText,
    Paragraph,
    Quote,
} from '@/components/RichText';

import { AttachBodyClass } from './AttachBodyClass';
import {
    Attachment,
    Embed,
    Gallery,
    Image,
    StoryBookmark,
    StoryBookmarkContextProvider,
    Variable,
    VariableContextProvider,
    Video,
} from './components';

import styles from './ContentRenderer.module.scss';

interface Props {
    nodes: Node | Node[];
    story?: ExtendedStory;
}

export function ContentRenderer({ nodes, story }: Props) {
    function renderDate(date: string) {
        return <FormattedDate value={date} />;
    }

    const renderer = (
        <div className={styles.renderer}>
            <AttachBodyClass className={styles.body} />

            <Renderer
                nodes={nodes}
                defaultComponents
                coverageEntries={story?.referenced_entities.coverages}
                renderDate={renderDate}
            >
                <Component match={AttachmentNode.isAttachmentNode} component={Attachment} />
                <Component
                    match={ButtonBlockNode.isButtonBlockNode}
                    component={Elements.ButtonBlock}
                />
                <Component match={EmbedNode.isEmbedNode} component={Embed} />
                <Component match={GalleryNode.isGalleryNode} component={Gallery} />
                {/* Title and Subtitle heading rules must be defined above the general Heading */}
                <Component match={HeadingNode.isTitleHeadingNode} component={Elements.Ignore} />
                <Component match={HeadingNode.isSubtitleHeadingNode} component={Elements.Ignore} />
                <Component match={HeadingNode.isHeadingNode} component={Heading} />
                <Component match={HtmlNode.isHtmlNode} component={Html} />
                <Component match={ImageNode.isImageNode} component={Image} />
                <Component match={LinkNode.isLinkNode} component={Link} />
                <Component match={ListNode.isListNode} component={List} />
                <Component match={ListItemNode.isListItemNode} component={ListItem} />
                <Component match={ListItemTextNode.isListItemTextNode} component={ListItemText} />
                <Component match={ParagraphNode.isParagraphNode} component={Paragraph} />
                <Component match={QuoteNode.isQuoteNode} component={Quote} />
                <Component match={VariableNode.isVariableNode} component={Variable} />
                <Component match={VideoNode.isVideoNode} component={Video} />
                <Component
                    match={StoryBookmarkNode.isStoryBookmarkNode}
                    component={StoryBookmark}
                />
            </Renderer>
        </div>
    );

    if (story) {
        return (
            <StoryBookmarkContextProvider referencedStories={story.referenced_entities.stories}>
                <VariableContextProvider value={{ [`publication.date`]: story.published_at }}>
                    {renderer}
                </VariableContextProvider>
            </StoryBookmarkContextProvider>
        );
    }

    return renderer;
}
