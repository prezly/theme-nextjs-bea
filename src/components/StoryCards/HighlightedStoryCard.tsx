'use client';

import { Category } from '@prezly/sdk';
import classNames from 'classnames';

import { FormattedDate, useLocale } from '@/adapters/client';
import type { ListStory } from '@/types';

import { Badge } from '../Badge';
import { Link } from '../Link';
import { StoryImage } from '../StoryImage';

import { StoryCard } from './StoryCard';

import styles from './HighlightedStoryCard.module.scss';

type Props = {
    fullWidth: boolean;
    rounded: boolean;
    showDate: boolean;
    showSubtitle: boolean;
    story: ListStory;
};

export function HighlightedStoryCard({ fullWidth, rounded, showDate, showSubtitle, story }: Props) {
    const locale = useLocale();
    const { categories, published_at, slug, subtitle } = story;

    const translatedCategories = Category.translations(categories, locale);

    if (fullWidth) {
        return (
            <div
                className={classNames(styles.container, {
                    [styles.rounded]: rounded,
                })}
            >
                <StoryImage
                    size="full-width"
                    className={styles.image}
                    placeholderClassName={styles.placeholder}
                    thumbnailImage={story.thumbnail_image}
                    title={story.title}
                />
                <div className={styles.overlay} />
                <div className={styles.content}>
                    {translatedCategories.length > 0 && (
                        <div className={styles.categories}>
                            {translatedCategories.map((category) => (
                                <Link
                                    className={styles.link}
                                    href={{
                                        routeName: 'category',
                                        params: { localeCode: locale, slug: category.slug },
                                    }}
                                    key={category.id}
                                >
                                    <Badge className={styles.badge} size="small">
                                        {category.name}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    )}
                    <h2
                        className={classNames(styles.title, {
                            [styles.expanded]: !showSubtitle || !subtitle,
                        })}
                    >
                        <Link
                            className={styles.titleLink}
                            href={{ routeName: 'story', params: { slug } }}
                        >
                            {story.title}
                            <span className={styles.mask} />
                        </Link>
                    </h2>
                    {showSubtitle && subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    {showDate && published_at && (
                        <div className={styles.date}>
                            <FormattedDate value={published_at} />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <StoryCard
            key={story.uuid}
            layout="horizontal"
            publishedAt={story.published_at}
            showDate={showDate}
            showSubtitle={showSubtitle}
            size="hero"
            slug={story.slug}
            subtitle={story.subtitle}
            thumbnailImage={story.thumbnail_image}
            title={story.title}
            titleAsString={story.title}
            translatedCategories={translatedCategories}
        />
    );
}
