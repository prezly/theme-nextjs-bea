'use client';

import type { Newsroom, TranslatedCategory } from '@prezly/sdk';
import type { Search } from '@prezly/theme-kit-nextjs';
import { useMemo } from 'react';
import type { Hit as HitType } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import { useLocale } from '@/adapters/client';
import { StoryCard } from '@/components/StoryCards';
import type { ThemeSettings } from '@/theme-settings';
import type { ExternalStoryUrl } from '@/types';
import { getNewsroomPlaceholderColors } from '@/utils';

export interface Props {
    hit: HitType<{ attributes: Search.IndexedStory; _tags: string[] }>;
    isExternal: ExternalStoryUrl;
    newsroom: Newsroom;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
}

export function Hit({
    hit,
    isExternal,
    newsroom,
    showDate,
    showSubtitle,
    storyCardVariant,
}: Props) {
    const { attributes: story } = hit;
    const { categories } = story;
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

    return (
        <StoryCard
            fallback={{
                image: newsroom.newsroom_logo,
                text: newsroom.name,
            }}
            isExternal={isExternal}
            layout="horizontal"
            placeholder={getNewsroomPlaceholderColors(newsroom)}
            publishedAt={new Date(story.published_at * 1000).toISOString()}
            showDate={showDate}
            showSubtitle={showSubtitle}
            size="small"
            slug={story.slug}
            subtitle={story.subtitle}
            thumbnailImage={story.thumbnail_image}
            title={<Highlight hit={hit} attribute="attributes.title" tagName="mark" />}
            titleAsString={hit.attributes.title}
            translatedCategories={displayedCategories}
            variant={storyCardVariant}
        />
    );
}
