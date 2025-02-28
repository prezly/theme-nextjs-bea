import type { ExtendedStory, Story as StoryType } from '@prezly/sdk';
import type { DocumentNode } from '@prezly/story-content-format';
import { Alignment, ImageNode } from '@prezly/story-content-format';
import classNames from 'classnames';

import { FormattedDate } from '@/adapters/client';
import { app } from '@/adapters/server';
import { CategoriesList } from '@/components/CategoriesList';
import { ContentRenderer } from '@/components/ContentRenderer';
import { getRenderableSocialSharingNetworks, SocialShare } from '@/components/SocialShare';
import type { StoryActions, ThemeSettings } from '@/theme-settings';

import { Embargo } from './Embargo';
import { HeaderImageRenderer } from './HeaderImageRenderer';
import { HeaderRenderer } from './HeaderRenderer';
import { getHeaderAlignment } from './lib';
import { RelatedStories } from './RelatedStories';
import { Share } from './Share';
import type { SharingOptions } from './type';

import styles from './Story.module.scss';

type Props = {
    showDate: ThemeSettings['show_date'];
    story: ExtendedStory;
    relatedStories: StoryType[];
    withHeaderImage: ThemeSettings['header_image_placement'];
    sharingOptions: SharingOptions;
    actions: StoryActions;
};

export async function Story({
    actions,
    relatedStories,
    sharingOptions,
    showDate,
    story,
    withHeaderImage,
}: Props) {
    const {
        links,
        visibility,
        thumbnail_url: thumbnailUrl,
        title,
        slug,
        summary,
        uuid,
        uploadcare_assets_group_uuid,
    } = story;
    const nodes = JSON.parse(story.content);
    const [headerImageDocument, mainDocument] = pullHeaderImageNode(nodes, withHeaderImage);
    const sharingUrl = links.short || links.newsroom_view;
    const sharingSocialNetworks = getRenderableSocialSharingNetworks(
        sharingOptions.sharing_actions,
        { thumbnailUrl, visibility },
    );

    const headerAlignment = getHeaderAlignment(nodes);

    const categories = await app().translatedCategories(story.culture.code, story.categories);

    return (
        <div className={styles.container}>
            <article className={styles.story}>
                <Embargo story={story} />
                {withHeaderImage === 'above' && headerImageDocument && (
                    <HeaderImageRenderer nodes={headerImageDocument} />
                )}
                {categories.length > 0 && (
                    <CategoriesList categories={categories} showAllCategories />
                )}
                <HeaderRenderer nodes={mainDocument} />
                <div
                    className={classNames(styles.linksAndDateWrapper, {
                        [styles.left]: headerAlignment === Alignment.LEFT,
                        [styles.right]: headerAlignment === Alignment.RIGHT,
                        [styles.center]: headerAlignment === Alignment.CENTER,
                    })}
                >
                    {showDate && story.published_at && (
                        <p className={styles.date}>
                            <FormattedDate value={story.published_at} />
                        </p>
                    )}
                    {sharingOptions.sharing_placement.includes('top') && (
                        <SocialShare
                            socialNetworks={sharingSocialNetworks}
                            url={sharingUrl}
                            title={title}
                            summary={summary}
                            uuid={uuid}
                            thumbnailUrl={thumbnailUrl}
                            trackingContext="Story Page Header"
                        />
                    )}
                </div>
                <ContentRenderer story={story} nodes={mainDocument} />
            </article>
            <Share
                actions={actions}
                thumbnailUrl={thumbnailUrl}
                socialNetworks={
                    sharingOptions.sharing_placement.includes('bottom') ? sharingSocialNetworks : []
                }
                summary={summary}
                slug={slug}
                title={title}
                uploadcareAssetsGroupUuid={uploadcare_assets_group_uuid}
                url={sharingUrl}
                uuid={uuid}
            />
            {relatedStories.length > 0 && <RelatedStories stories={relatedStories} />}
        </div>
    );
}

function pullHeaderImageNode(
    documentNode: DocumentNode,
    withHeaderImage: ThemeSettings['header_image_placement'],
): [DocumentNode | null, DocumentNode] {
    const { children } = documentNode;
    const [firstNode] = children;

    if (ImageNode.isImageNode(firstNode) && withHeaderImage === 'above') {
        return [
            { ...documentNode, children: [firstNode] },
            { ...documentNode, children: children.slice(1) },
        ];
    }

    return [null, documentNode];
}
