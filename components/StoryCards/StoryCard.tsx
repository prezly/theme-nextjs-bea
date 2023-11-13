'use client';

import classNames from 'classnames';
import { useMemo } from 'react';

import { Link } from '@/components/Link';
import { useDevice } from '@/hooks';
import { FormattedDate, useLocale } from '@/theme/client';
import { categoryTranslations } from '@/theme-kit/domain';
import type { ListStory } from 'types';

import { CategoriesList } from '../CategoriesList';
import { StoryImage } from '../StoryImage';

import styles from './StoryCard.module.scss';

type Props = {
    story: ListStory;
    size?: 'small' | 'medium' | 'big';
    showDate: boolean;
    showSubtitle: boolean;
};

export function StoryCard({ story, size = 'small', showDate, showSubtitle }: Props) {
    const { categories, title, subtitle } = story;
    const localeCode = useLocale();
    const { isTablet } = useDevice(); // TODO: It would be more performant if done with pure CSS

    const translatedCategories = useMemo(
        () => categoryTranslations(categories, localeCode),
        [categories, localeCode],
    );

    const hasCategories = translatedCategories.length > 0;
    const HeadingTag = size === 'small' ? 'h3' : 'h2';
    const shouldShowSubtitle = isTablet ? true : size !== 'small';

    return (
        <div
            className={classNames(styles.container, {
                [styles.small]: size === 'small',
                [styles.medium]: size === 'medium',
                [styles.big]: size === 'big',
            })}
        >
            <Link href={{ routeName: 'story', params: story }} className={styles.imageWrapper}>
                <StoryImage
                    story={story}
                    size={size}
                    className={styles.image}
                    placeholderClassName={styles.placeholder}
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

                {subtitle && showSubtitle && shouldShowSubtitle && (
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
