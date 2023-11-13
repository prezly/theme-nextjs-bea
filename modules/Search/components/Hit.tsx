import type { AlgoliaStory } from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';
import classNames from 'classnames';
import { useMemo } from 'react';
import type { Hit as HitType } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import { CategoriesList } from '@/components/CategoriesList';
import { Link } from '@/components/Link';
import { StoryImage } from '@/components/StoryImage';
import { FormattedDate, useRouting } from '@/theme/client';
import type { DisplayedCategory } from '@/theme-kit';

import styles from './Hit.module.scss';
import cardStyles from '@/components/StoryCards/StoryCard.module.scss';

export interface Props {
    hit: HitType<{ attributes: AlgoliaStory }>;
}

// This is mostly a copy of `StoryCard` component, but since the data structure is a bit different,
// it requires a separate component for Algolia-specific content
export function Hit({ hit }: Props) {
    const { attributes: story } = hit;
    const { categories } = story;
    const { showDate, showSubtitle } = { showDate: true, showSubtitle: true }; // FIXME: useThemeSettings();
    const { generateUrl } = useRouting();

    const displayedCategories: DisplayedCategory[] = useMemo(
        () =>
            categories
                .map(({ id, slug, name }) => {
                    if (!slug) return undefined;

                    const href = generateUrl('category', { slug });

                    return { id, name, href, description: null };
                })
                .filter(isNotUndefined),
        [generateUrl, categories],
    );

    // strip query params from story links
    const storyLink = {
        routeName: 'story',
        params: { slug: story.slug },
    } as const;

    return (
        <div className={classNames(cardStyles.container, cardStyles.small)}>
            <Link href={storyLink} className={cardStyles.imageWrapper}>
                <StoryImage
                    story={story}
                    size="small"
                    className={cardStyles.image}
                    placeholderClassName={cardStyles.placeholder}
                />
            </Link>
            <div className={cardStyles.content}>
                {categories.length > 0 && (
                    <div className={cardStyles.categories}>
                        <CategoriesList categories={displayedCategories} isStatic />
                    </div>
                )}
                <h3 className={classNames(cardStyles.title, cardStyles.titleSmaller)}>
                    <Link
                        href={storyLink}
                        className={classNames(cardStyles.titleLink, styles.title)}
                    >
                        <Highlight hit={hit} attribute="attributes.title" tagName="mark" />
                    </Link>
                </h3>

                {showSubtitle && (
                    <p className={cardStyles.subtitle}>
                        <Link href={storyLink} className={cardStyles.titleLink}>
                            {story.subtitle}
                        </Link>
                    </p>
                )}

                {showDate && story.published_at && (
                    <p className={cardStyles.date}>
                        <FormattedDate value={story.published_at} />
                    </p>
                )}
            </div>
        </div>
    );
}
