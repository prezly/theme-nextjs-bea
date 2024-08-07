'use client';

import type { Category } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import { useMemo } from 'react';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { StaggeredLayout } from '@/components/StaggeredLayout';
import { HighlightedStoryCard, StoryCard } from '@/components/StoryCards';
import type { ListStory } from 'types';

import { useStoryCardLayout } from './lib';
import { CategoriesFilters } from './ui';

import Illustration from '@/public/images/no-stories-illustration.svg';

import styles from './StoriesList.module.scss';

type Props = {
    categories?: Category[];
    category?: Pick<Category, 'id'>;
    isCategoryList?: boolean;
    layout?: 'grid' | 'masonry';
    newsroomName: string;
    showDate: boolean;
    showSubtitle: boolean;
    stories: ListStory[];
};

export function StoriesList({
    categories = [],
    category,
    isCategoryList = false,
    layout = 'grid',
    newsroomName,
    showDate,
    showSubtitle,
    stories,
}: Props) {
    const locale = useLocale();
    const hasCategories = categories.length > 0;

    const [highlightedStories, restStories] = useMemo(() => {
        if (isCategoryList) {
            return [[], stories];
        }
        // When there are only two stories and no categories to filter,
        // they should be both displayed as highlighted
        if (stories.length === 2 && !hasCategories) {
            return [stories, []];
        }

        return [stories.slice(0, 1), stories.slice(1)];
    }, [hasCategories, isCategoryList, stories]);

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
                        <HighlightedStoryCard key={story.uuid} story={story} showDate={showDate} />
                    ))}
                </div>
            )}
            {hasCategories && (
                <CategoriesFilters
                    activeCategory={category}
                    categories={categories}
                    className={styles.filtersContainer}
                    locale={locale}
                />
            )}
            {restStories.length > 0 && layout === 'grid' && (
                <div className={styles.storiesContainer}>
                    {restStories.map((story, index) => (
                        <StoryCard
                            key={story.uuid}
                            story={story}
                            size={getStoryCardSize(index)}
                            showDate={showDate}
                            showSubtitle={showSubtitle}
                        />
                    ))}
                </div>
            )}
            {restStories.length > 0 && layout === 'masonry' && (
                <StaggeredLayout className={styles.staggered}>
                    {restStories.map((story) => (
                        <StoryCard
                            key={story.uuid}
                            className={styles.card}
                            story={story}
                            size="medium"
                            showDate={showDate}
                            showSubtitle={showSubtitle}
                            withStaticImage
                        />
                    ))}
                </StaggeredLayout>
            )}
        </>
    );
}
