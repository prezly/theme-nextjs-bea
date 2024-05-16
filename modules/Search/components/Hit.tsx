'use client';

import type { TranslatedCategory } from '@prezly/sdk';
import type { Search } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useMemo } from 'react';
import type { Hit as HitType } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import { FormattedDate, useLocale } from '@/adapters/client';
import { CategoriesList } from '@/components/CategoriesList';
import { Link } from '@/components/Link';
import { StoryImage } from '@/components/StoryImage';
import { useThemeSettingsWithPreview } from '@/hooks';

import styles from './Hit.module.scss';
import cardStyles from '@/components/StoryCards/StoryCard.module.scss';

export interface Props {
    hit: HitType<{ attributes: Search.IndexedStory }>;
}

// This is mostly a copy of `StoryCard` component, but since the data structure is a bit different,
// it requires a separate component for Algolia-specific content
export function Hit({ hit }: Props) {
    const { attributes: story } = hit;
    const { categories } = story;
    const settings = useThemeSettingsWithPreview();
    const localeCode = useLocale();

    const displayedCategories: TranslatedCategory[] = useMemo(
        () =>
            categories
                .map(({ id, slug, name }) => ({
                    id,
                    locale: localeCode,
                    name,
                    slug,
                    description: null,
                    public_stories_number: 0, // We do not have access to number of stories from Algolia
                }))
                .filter((category) => Boolean(category.slug)),
        [localeCode, categories],
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
                {displayedCategories.length > 0 && (
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

                {settings.show_subtitle && (
                    <p className={cardStyles.subtitle}>
                        <Link href={storyLink} className={cardStyles.titleLink}>
                            {story.subtitle}
                        </Link>
                    </p>
                )}

                {settings.show_date && story.published_at && (
                    <p className={cardStyles.date}>
                        <FormattedDate value={story.published_at} />
                    </p>
                )}
            </div>
        </div>
    );
}
