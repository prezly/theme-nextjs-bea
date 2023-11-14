import type { ExtendedStory } from '@prezly/sdk';
import { Alignment } from '@prezly/story-content-format';
import classNames from 'classnames';

import { CategoriesList } from '@/components/CategoriesList';
import { ContentRenderer } from '@/components/ContentRenderer';
import { StoryLinks } from '@/components/StoryLinks';
import { FormattedDate } from '@/theme/client';
import { app } from '@/theme/server';

import { Embargo } from './Embargo';
import { HeaderRenderer } from './HeaderRenderer';
import { getHeaderAlignment } from './lib';

import styles from './Story.module.scss';

type Props = {
    story: ExtendedStory;
};

export async function Story({ story }: Props) {
    const settings = await app().themeSettings();

    const { links } = story;
    const nodes = JSON.parse(story.content);

    const headerAlignment = getHeaderAlignment(nodes);

    const categories = await app().translatedCategories(app().locale(), story.categories);

    return (
        <article className={styles.story}>
            <div className={styles.container}>
                <Embargo story={story} />
                {categories.length > 0 && (
                    <CategoriesList categories={categories} showAllCategories />
                )}
                <HeaderRenderer nodes={nodes} />
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
                    <StoryLinks url={links.short || links.newsroom_view} />
                </div>
                <ContentRenderer story={story} nodes={nodes} />
            </div>
        </article>
    );
}
