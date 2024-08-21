'use client';

import { Category } from '@prezly/sdk';
import { useMemo } from 'react';

import { useLocale } from '@/adapters/client';
import type { ListStory } from 'types';

import { StoryCard } from './StoryCard';

type Props = {
    showDate: boolean;
    showSubtitle: boolean;
    story: ListStory;
};

export function HighlightedStoryCard({ showDate, showSubtitle, story }: Props) {
    const localeCode = useLocale();
    const { categories } = story;

    const translatedCategories = useMemo(
        () => Category.translations(categories, localeCode),
        [categories, localeCode],
    );

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
