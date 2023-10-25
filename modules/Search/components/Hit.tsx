import type { AlgoliaStory } from '@prezly/theme-kit-core';
import classNames from 'classnames';
import Link from 'next/link';
import type { Hit } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import { CategoriesList, StoryImage, StoryPublicationDate } from '@/components';
import { useThemeSettings } from '@/hooks';

import styles from './Hit.module.scss';
import cardStyles from '@/components/StoryCards/StoryCard.module.scss';

interface Props {
    hit: Hit<{ attributes: AlgoliaStory }>;
}

// This is mostly a copy of `StoryCard` component, but since the data structure is a bit different,
// it requires a separate component for Algolia-specific content
function HitComponent({ hit }: Props) {
    const { attributes: story } = hit;
    const { categories } = story;
    const { showDate, showSubtitle } = useThemeSettings();

    // strip query params from story links
    const storyLink = {
        pathname: '/[slug]',
        query: { slug: story.slug },
    };

    return (
        <div className={classNames(cardStyles.container, cardStyles.small)}>
            <Link
                href={storyLink}
                locale={false}
                className={cardStyles.imageWrapper}
                legacyBehavior
            >
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
                        <CategoriesList categories={categories} isStatic />
                    </div>
                )}
                <h3 className={classNames(cardStyles.title, cardStyles.titleSmaller)}>
                    <Link
                        href={storyLink}
                        locale={false}
                        className={classNames(cardStyles.titleLink, styles.title)}
                        legacyBehavior
                    >
                        <Highlight hit={hit} attribute="attributes.title" tagName="mark" />
                    </Link>
                </h3>

                {showSubtitle && (
                    <p className={cardStyles.subtitle}>
                        <Link
                            href={storyLink}
                            locale={false}
                            className={cardStyles.titleLink}
                            legacyBehavior
                        >
                            {story.subtitle}
                        </Link>
                    </p>
                )}

                {showDate && (
                    <p className={cardStyles.date}>
                        <StoryPublicationDate story={story} />
                    </p>
                )}
            </div>
        </div>
    );
}

export default HitComponent;
