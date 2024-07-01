import type { ExtendedStory } from '@prezly/sdk';
import type { DocumentNode } from '@prezly/story-content-format';
import { Alignment, ImageNode } from '@prezly/story-content-format';
import classNames from 'classnames';

import { FormattedDate } from '@/adapters/client';
import { app } from '@/adapters/server';
import { CategoriesList } from '@/components/CategoriesList';
import { ContentRenderer } from '@/components/ContentRenderer';
import { StoryLinks } from '@/components/StoryLinks';
import type { ThemeSettings } from 'theme-settings';

import { Embargo } from './Embargo';
import { HeaderImageRenderer } from './HeaderImageRenderer';
import { HeaderRenderer } from './HeaderRenderer';
import { getHeaderAlignment } from './lib';

import styles from './Story.module.scss';

type Props = {
    story: ExtendedStory;
    withHeaderImage: ThemeSettings['header_image_placement'];
    withSharingIcons: ThemeSettings['show_sharing_icons'];
};

export async function Story({ story, withHeaderImage, withSharingIcons }: Props) {
    const settings = await app().themeSettings();

    const { links, visibility } = story;
    const nodes = JSON.parse(story.content);
    const [headerImageDocument, mainDocument] = pullHeaderImageNode(nodes, withHeaderImage);

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
                    {settings.show_date && story.published_at && (
                        <p className={styles.date}>
                            <FormattedDate value={story.published_at} />
                        </p>
                    )}
                    {visibility === 'public' && withSharingIcons && (
                        <StoryLinks url={links.short || links.newsroom_view} />
                    )}
                </div>
                <ContentRenderer story={story} nodes={mainDocument} />
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
