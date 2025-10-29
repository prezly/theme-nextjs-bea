import type { TranslatedCategory } from '@prezly/sdk';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { FormattedDate } from '@/adapters/client';
import { Link } from '@/components/Link';
import type { ExternalStoryUrl, ListStory } from '@/types';

import { CategoriesList } from '../CategoriesList';
import { StoryImage } from '../StoryImage';

import styles from './StoryCard.module.scss';

type Props = {
    className?: string;
    external: ExternalStoryUrl;
    fallback: StoryImage.Props['fallback'];
    forceAspectRatio?: boolean;
    layout: 'horizontal' | 'vertical';
    placeholder: StoryImage.Props['placeholder'];
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
    external,
    fallback,
    forceAspectRatio,
    layout,
    placeholder,
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
    const Wrapper = variant === 'boxed' ? Link : 'div';

    const href = external
        ? external.storyUrl
        : ({ routeName: 'story', params: { slug } } satisfies Link.Props['href']);

    return (
        <Wrapper
            className={classNames(styles.container, className, {
                [styles.boxed]: variant === 'boxed',
                [styles.hero]: size === 'hero',
                [styles.small]: size === 'small',
                [styles.horizontal]: layout === 'horizontal',
                [styles.vertical]: layout === 'vertical',
                [styles.withStaticImage]: withStaticImage,
            })}
            href={href}
        >
            <Link href={href} className={styles.imageWrapper} title={titleAsString}>
                <StoryImage
                    className={styles.image}
                    fallback={fallback}
                    forceAspectRatio={forceAspectRatio ? 4 / 3 : undefined}
                    isStatic={withStaticImage}
                    placeholder={placeholder}
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
                            external={external}
                            isStatic
                            showAllCategories
                            withBadges={variant === 'boxed'}
                        />
                    )}
                </div>
                <HeadingTag
                    className={classNames(styles.title, {
                        [styles.expanded]: !showSubtitle || !subtitle,
                    })}
                >
                    <Link href={href} className={styles.titleLink}>
                        {title}
                    </Link>
                </HeadingTag>
                {showSubtitle && subtitle && (
                    <p className={styles.subtitle}>
                        <Link href={href} className={styles.subtitleLink}>
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
        </Wrapper>
    );
}
