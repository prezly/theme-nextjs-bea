'use client';

import type { Category } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import { useMemo } from 'react';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { HighlightedStoryCard, StoryCard } from '@/components/StoryCards';
import type { ListStory } from 'types';

import { useStoryCardLayout } from './lib';
import { CategoriesFilters } from './ui';

import Illustration from '@/public/images/no-stories-illustration.svg';

import styles from './StoriesList.module.scss';

type Props = {
    newsroomName: string;
    stories: ListStory[];
    category?: Pick<Category, 'id'>;
    categories?: Category[];
    isCategoryList?: boolean;
};

export function StoriesList({
    newsroomName,
    stories,
    category,
    categories = [],
    isCategoryList = false,
}: Props) {
    const locale = useLocale();

    const featuredCategories = useMemo(
        () =>
            categories.filter(
                ({ is_featured, i18n }) => is_featured && i18n[locale]?.public_stories_number > 0,
            ),
        [categories, locale],
    );

    const hasFeaturedCategories = featuredCategories.length > 0;

    const [highlightedStories, restStories] = useMemo(() => {
        if (isCategoryList) {
            return [[], stories];
        }
        // When there are only two stories and no featured categories,
        // they should be both displayed as highlighted
        if (stories.length === 2 && !hasFeaturedCategories) {
            return [stories, []];
        }

        return [stories.slice(0, 1), stories.slice(1)];
    }, [hasFeaturedCategories, isCategoryList, stories]);

    const getStoryCardSize = useStoryCardLayout(isCategoryList, restStories.length);

    if (!highlightedStories.length && !restStories.length) {
        return (
            <div className={styles.noStories}>
                <Illustration />
                <h1 className={styles.noStoriesTitle}>
                    <FormattedMessage
                        locale={locale}
                        for={translations.noStories.title}
                        values={{ newsroom: newsroomName }}
                    />
                </h1>
                <p className={styles.noStoriesSubtitle}>
                    <FormattedMessage locale={locale} for={translations.noStories.subtitle} />
                </p>
            </div>
        );
    }

    return (
        <>
            {highlightedStories.length > 0 && (
                <div className={styles.highlightedStoriesContainer}>
                    {highlightedStories.map((story) => (
                        <HighlightedStoryCard key={story.uuid} story={story} />
                    ))}
                </div>
            )}
            {hasFeaturedCategories && (
                <CategoriesFilters
                    activeCategory={category}
                    categories={featuredCategories}
                    className={styles.filtersContainer}
                    locale={locale}
                />
            )}
            {restStories.length > 0 && (
                <div className={styles.storiesContainer}>
                    {restStories.map((story, index) => (
                        <StoryCard key={story.uuid} story={story} size={getStoryCardSize(index)} />
                    ))}
                </div>
            )}
        </>
    );
}
