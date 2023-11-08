import type { ExtendedStory } from '@prezly/sdk';
import { Alignment } from '@prezly/story-content-format';
// import { isEmbargoStory } from '@prezly/theme-kit-core';
import classNames from 'classnames';

// import { CategoriesList } from '@/components/CategoriesList';
import { ContentRenderer } from '@/components/ContentRenderer';
import { StoryLinks } from '@/components/StoryLinks';
// import { StoryPublicationDate } from '@/components/StoryPublicationDate';
// import type { DisplayedCategory } from '@/theme-kit';
import { getHeaderAlignment } from '@/utils';

import type { ThemeSettings } from '../../types';

// import { Embargo } from './Embargo';
import { HeaderRenderer } from './HeaderRenderer';

import styles from './Story.module.scss';

type Props = {
    story: ExtendedStory;
    settings: ThemeSettings;
};

export function Story({ story, settings }: Props) {
    const { categories, links } = story;
    // const hasCategories = categories.length > 0;
    const nodes = JSON.parse(story.content);

    const headerAlignment = getHeaderAlignment(nodes);

    return (
        <article className={styles.story}>
            <div className={styles.container}>
                {/* <Embargo story={story} /> */}
                {/* {hasCategories && <CategoriesList categories={categories} showAllCategories />} */}
                <HeaderRenderer nodes={nodes} />
                <div
                    className={classNames(styles.linksAndDateWrapper, {
                        [styles.left]: headerAlignment === Alignment.LEFT,
                        [styles.right]: headerAlignment === Alignment.RIGHT,
                        [styles.center]: headerAlignment === Alignment.CENTER,
                    })}
                >
                    {settings.show_date && (
                        <p className={styles.date}>
                            {/* <StoryPublicationDate story={story} /> */}
                        </p>
                    )}
                    <StoryLinks url={links.short || links.newsroom_view} />
                </div>
                <ContentRenderer nodes={nodes} />
            </div>
        </article>
    );
}
