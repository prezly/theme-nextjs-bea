import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent, useMemo } from 'react';
import type { Hit } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import { CategoriesList, StoryImage } from '@/components';
import { useCategories } from '@/hooks';
import { getStoryPublicationDate } from '@/utils/prezly';
import { AlgoliaStory } from 'types';

import styles from './Hit.module.scss';
import cardStyles from '@/components/StoryCards/StoryCard.module.scss';

interface Props {
    hit: Hit<{ attributes: AlgoliaStory }>;
}

// This is mostly a copy of `StoryCard` component, but since the data structure is a bit different,
// it requires a separate component for Algolia-specific content
const HitComponent: FunctionComponent<Props> = ({ hit }) => {
    const { attributes: story } = hit;
    const { categories: storyCategories } = story;
    const categories = useCategories();

    const publishedDate = getStoryPublicationDate(story);

    const displayedCategories = useMemo(() => {
        const storyCategoryIds = storyCategories.map(({ id }) => id);
        return categories.filter(({ id }) => storyCategoryIds.includes(id));
    }, [categories, storyCategories]);

    return (
        <div className={classNames(cardStyles.container, cardStyles.small)}>
            <Link href={`/${story.slug}`} locale={false} passHref>
                <a className={cardStyles.imageWrapper}>
                    <StoryImage
                        story={story}
                        className={cardStyles.image}
                        placeholderClassName={cardStyles.placeholder}
                    />
                </a>
            </Link>
            <div className={cardStyles.content}>
                {displayedCategories.length > 0 && (
                    <div className={cardStyles.categories}>
                        <CategoriesList categories={displayedCategories} isStatic />
                    </div>
                )}
                <h3 className={classNames(cardStyles.title, cardStyles.titleSmaller)}>
                    <Link href={`/${story.slug}`} locale={false} passHref>
                        <a className={classNames(cardStyles.titleLink, styles.title)}>
                            <Highlight hit={hit} attribute="attributes.title" tagName="mark" />
                        </a>
                    </Link>
                </h3>

                {publishedDate && <p className={cardStyles.date}>{publishedDate}</p>}
            </div>
        </div>
    );
};

export default HitComponent;
