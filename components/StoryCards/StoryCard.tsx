'use client';

import type { TranslatedCategory } from '@prezly/sdk';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { FormattedDate } from '@/adapters/client';
import { Link } from '@/components/Link';
import type { ListStory } from 'types';

import { CategoriesList } from '../CategoriesList';
import { StoryImage } from '../StoryImage';

import styles from './StoryCard.module.scss';

type Props = {
    className?: string;
    layout: 'horizontal' | 'vertical';
    publishedAt: string | null;
    showDate: boolean;
    showSubtitle: boolean;
    size?: 'small' | 'medium' | 'big' | 'hero';
    slug: string;
    subtitle: ReactNode;
    thumbnailImage: ListStory['thumbnail_image'];
    title: ReactNode;
    titleAsString: string;
    translatedCategories: TranslatedCategory[];
    variant?: 'default' | 'boxed';
    withStaticImage?: boolean;
};

export function StoryCard({
    className,
    layout,
    publishedAt,
    showDate,
    showSubtitle,
    size = 'small',
    slug,
    subtitle,
    thumbnailImage,
    title,
    titleAsString,
    translatedCategories,
    variant = 'default',
    withStaticImage = false,
}: Props) {
    const hasCategories = translatedCategories.length > 0;
    const HeadingTag = size === 'small' ? 'h3' : 'h2';

    return (
        <div
            className={classNames(styles.container, className, {
                [styles.boxed]: variant === 'boxed',
                [styles.hero]: size === 'hero',
                [styles.small]: size === 'small',
                [styles.horizontal]: layout === 'horizontal',
                [styles.vertical]: layout === 'vertical',
                [styles.withStaticImage]: withStaticImage,
            })}
        >
            <Link
                href={{ routeName: 'story', params: { slug } }}
                className={styles.imageWrapper}
                title={titleAsString}
            >
                <StoryImage
                    className={styles.image}
                    isStatic={withStaticImage}
                    placeholderClassName={styles.placeholder}
                    size={size}
                    thumbnailImage={thumbnailImage}
                    title={titleAsString}
                />
            </Link>
            <div className={styles.content}>
                <div className={styles.meta}>
                    {hasCategories && (
                        <CategoriesList
                            categories={translatedCategories}
                            className={styles.categories}
                            isStatic
                            withBadges={variant === 'boxed'}
                        />
                    )}
                </div>
                <HeadingTag className={styles.title}>
                    <Link
                        href={{ routeName: 'story', params: { slug } }}
                        className={styles.titleLink}
                    >
                        {title}
                    </Link>
                </HeadingTag>
                {showSubtitle && subtitle && (
                    <p className={styles.subtitle}>
                        <Link
                            href={{ routeName: 'story', params: { slug } }}
                            className={styles.subtitleLink}
                        >
                            {subtitle}
                        </Link>
                    </p>
                )}
                {showDate && publishedAt && (
                    <div className={styles.date}>
                        <FormattedDate value={publishedAt} />
                    </div>
                )}
            </div>
        </div>
    );
}
