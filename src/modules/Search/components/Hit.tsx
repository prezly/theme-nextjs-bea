'use client';

import type { Newsroom, TranslatedCategory } from '@prezly/sdk';
import { translations, type Search } from '@prezly/theme-kit-nextjs';
import { useMemo } from 'react';
import type { Hit as HitType } from 'react-instantsearch-core';
import { Highlight } from 'react-instantsearch-dom';

import { useIntl, useLocale } from '@/adapters/client';
import { StoryCard } from '@/components/StoryCards';
import type { ThemeSettings } from '@/theme-settings';
import type { ExternalStoryUrl } from '@/types';
import { getNewsroomPlaceholderColors } from '@/utils';

import styles from './Hit.module.scss';

export interface Props {
    external: ExternalStoryUrl;
    hit: HitType<{ attributes: Search.IndexedStory; _tags: string[] }>;
    newsroom: Newsroom;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
}

export function Hit({ external, hit, newsroom, showDate, showSubtitle, storyCardVariant }: Props) {
    const { attributes: story } = hit;
    const { categories } = story;
    const localeCode = useLocale();
    const { formatMessage } = useIntl();

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
            className={styles.card}
            external={external}
            fallback={{
                image: newsroom.newsroom_logo,
                text: newsroom.name,
            }}
            layout="horizontal"
            placeholder={getNewsroomPlaceholderColors(newsroom)}
            publishedAt={new Date(story.published_at * 1000).toISOString()}
            showDate={showDate}
            showReadMore
            readMoreLabel={formatMessage(translations.actions.readMore)}
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
