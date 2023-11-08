import type { ExtendedStory } from '@prezly/sdk';
import { Alignment } from '@prezly/story-content-format';
import { getCategoryHasTranslation, getLocalizedCategoryData } from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';
import classNames from 'classnames';

import { CategoriesList } from '@/components/CategoriesList';
import { ContentRenderer } from '@/components/ContentRenderer';
import { StoryLinks } from '@/components/StoryLinks';
import { locale, routing } from '@/theme-kit';
import { FormattedDate } from '@/theme-kit/intl/client';
import { getHeaderAlignment } from '@/utils';

import type { ThemeSettings } from '../../types';

import { Embargo } from './Embargo';
import { HeaderRenderer } from './HeaderRenderer';

import styles from './Story.module.scss';

type Props = {
    story: ExtendedStory;
    settings: ThemeSettings; // FIXME: Move settings fetching to this component
};

export async function Story({ story, settings }: Props) {
    const { code: localeCode } = locale();
    const { generateUrl } = await routing();

    const { categories, links } = story;
    const hasCategories = categories.length > 0;
    const nodes = JSON.parse(story.content);

    const headerAlignment = getHeaderAlignment(nodes);

    // FIXME: Add a helper function to deduplicate this code everywhere
    const displayedCategories = categories
        .filter((category) => getCategoryHasTranslation(category, localeCode))
        .map((category) => {
            const { id } = category;
            const { name, description, slug } = getLocalizedCategoryData(category, localeCode);
            if (slug) {
                const href = generateUrl('category', { slug, localeCode });

                return { id, name, description, href };
            }
            return undefined;
        })
        .filter(isNotUndefined);

    return (
        <article className={styles.story}>
            <div className={styles.container}>
                <Embargo story={story} />
                {hasCategories && (
                    <CategoriesList categories={displayedCategories} showAllCategories />
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
