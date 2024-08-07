'use client';

import { Category } from '@prezly/sdk';
import classNames from 'classnames';
import { useMemo } from 'react';

import { FormattedDate, useLocale } from '@/adapters/client';
import { Link } from '@/components/Link';
import { useDevice } from '@/hooks';
import type { ListStory } from 'types';

import { CategoriesList } from '../CategoriesList';
import { StoryImage } from '../StoryImage';

import styles from './StoryCard.module.scss';

type Props = {
    className?: string;
    showDate: boolean;
    showSubtitle: boolean;
    size?: 'small' | 'medium' | 'big';
    story: ListStory;
    withStaticImage?: boolean;
};

export function StoryCard({
    className,
    showDate,
    showSubtitle,
    size = 'small',
    story,
    withStaticImage = false,
}: Props) {
    const { categories, title, subtitle } = story;
    const localeCode = useLocale();
    const { isTablet } = useDevice(); // TODO: It would be more performant if done with pure CSS

    const translatedCategories = useMemo(
        () => Category.translations(categories, localeCode),
        [categories, localeCode],
    );

    const hasCategories = translatedCategories.length > 0;
    const HeadingTag = size === 'small' ? 'h3' : 'h2';
    const shouldShowSubtitle = isTablet ? true : size !== 'small';

    return (
        <div
            className={classNames(styles.container, className, {
                [styles.small]: size === 'small',
                [styles.medium]: size === 'medium',
                [styles.big]: size === 'big',
                [styles.withStaticImage]: withStaticImage,
            })}
        >
            <Link
                href={{ routeName: 'story', params: story }}
                className={styles.imageWrapper}
                title={title}
            >
                <StoryImage
                    story={story}
                    size={size}
                    className={styles.image}
                    placeholderClassName={styles.placeholder}
                    isStatic={withStaticImage}
                />
            </Link>
            <div className={styles.content}>
                {hasCategories && (
                    <CategoriesList
                        categories={translatedCategories}
                        className={styles.categories}
                        showAllCategories={size !== 'small'}
                        isStatic
                    />
                )}

                <HeadingTag
                    className={classNames(styles.title, {
                        [styles.noCategories]: !hasCategories,
                        [styles.noDate]: !showDate,
                        [styles.noDateAndCategories]: !hasCategories && !showDate,
                        [styles.extendedTitle]: size !== 'small' && !subtitle.length,
                    })}
                >
                    <Link href={{ routeName: 'story', params: story }} className={styles.titleLink}>
                        {title}
                    </Link>
                </HeadingTag>

                {showSubtitle && subtitle && shouldShowSubtitle && (
                    <p className={styles.subtitle}>
                        <Link
                            href={{ routeName: 'story', params: story }}
                            className={styles.subtitleLink}
                        >
                            {subtitle}
                        </Link>
                    </p>
                )}

                {showDate && story.published_at && (
                    <p className={styles.date}>
                        <FormattedDate value={story.published_at} />
                    </p>
                )}
            </div>
        </div>
    );
}
