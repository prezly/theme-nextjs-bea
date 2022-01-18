import classNames from 'classnames';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import type { Hit } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import StoryImage from '@/components/StoryImage';
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
    const { categories } = story;

    const publishedDate = getStoryPublicationDate(story);

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
                {categories.length > 0 && (
                    <div className={cardStyles.categories}>
                        {/* TODO: The are no slugs in Algolia category objects, so it's not possible to create a link */}
                        {/* <CategoriesList categories={categories} isStatic /> */}
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
