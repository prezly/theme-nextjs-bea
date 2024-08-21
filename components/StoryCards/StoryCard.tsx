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
    isHero?: boolean;
    layout: 'horizontal' | 'vertical';
    publishedAt: string | null;
    showDate: boolean;
    showSubtitle: boolean;
    size?: 'small' | 'medium' | 'big';
    slug: string;
    subtitle: ReactNode;
    thumbnailImage: ListStory['thumbnail_image'];
    title: ReactNode;
    titleAsString: string;
    translatedCategories: TranslatedCategory[];
    withStaticImage?: boolean;
};

export function StoryCard({
    className,
    isHero = false,
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
    withStaticImage = false,
}: Props) {
    const hasCategories = translatedCategories.length > 0;
    const HeadingTag = size === 'small' ? 'h3' : 'h2';

    return (
        <div
            className={classNames(styles.container, className, {
                [styles.hero]: isHero,
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
                    {showDate && publishedAt && (
                        <span className={styles.date}>
                            <FormattedDate value={publishedAt} />
                        </span>
                    )}
                    {hasCategories && (
                        <CategoriesList
                            categories={translatedCategories}
                            className={styles.categories}
                            isStatic
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
            </div>
        </div>
    );
}
