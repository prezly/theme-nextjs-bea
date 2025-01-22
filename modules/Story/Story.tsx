import type { ExtendedStory } from '@prezly/sdk';
import type { DocumentNode } from '@prezly/story-content-format';
import { Alignment, ImageNode } from '@prezly/story-content-format';
import classNames from 'classnames';

import { FormattedDate } from '@/adapters/client';
import { app } from '@/adapters/server';
import { CategoriesList } from '@/components/CategoriesList';
import { ContentRenderer } from '@/components/ContentRenderer';
import type { SharingOptions, ThemeSettings } from 'theme-settings';

import { Embargo } from './Embargo';
import { HeaderImageRenderer } from './HeaderImageRenderer';
import { HeaderRenderer } from './HeaderRenderer';
import { getHeaderAlignment } from './lib';
import { Share } from './Share';

import styles from './Story.module.scss';

type Props = {
    showDate: ThemeSettings['show_date'];
    story: ExtendedStory;
    withHeaderImage: ThemeSettings['header_image_placement'];
    withSharingIcons: ThemeSettings['show_sharing_icons'];
    sharingOptions: SharingOptions;
};

export async function Story({
    sharingOptions,
    showDate,
    story,
    withHeaderImage,
    withSharingIcons,
}: Props) {
    const { links, visibility, thumbnail_url: thumbnailUrl } = story;
    const nodes = JSON.parse(story.content);
    const [headerImageDocument, mainDocument] = pullHeaderImageNode(nodes, withHeaderImage);
    const sharingUrl = links.short || links.newsroom_view;

    const headerAlignment = getHeaderAlignment(nodes);

    const categories = await app().translatedCategories(story.culture.code, story.categories);

    return (
        <article className={styles.story}>
            <div className={styles.container}>
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
                </div>
                <ContentRenderer story={story} nodes={mainDocument} />
                {visibility === 'public' && withSharingIcons && sharingUrl && (
                    <Share
                        sharingOptions={sharingOptions}
                        thumbnailUrl={thumbnailUrl}
                        url={sharingUrl}
                    />
                )}
            </div>
        </article>
    );
}

function pullHeaderImageNode(
    documentNode: DocumentNode,
    withHeaderImage: ThemeSettings['header_image_placement'],
): [DocumentNode | null, DocumentNode] {
    const { children } = documentNode;
    const firstNode = children[0];

    if (ImageNode.isImageNode(firstNode) && withHeaderImage === 'above') {
        return [
            { ...documentNode, children: [firstNode] },
            { ...documentNode, children: children.slice(1) },
        ];
    }

    return [null, documentNode];
}
