'use client';

import type { Newsroom, TranslatedCategory } from '@prezly/sdk';
import type { Search } from '@prezly/theme-kit-nextjs';
import { useMemo } from 'react';
import type { Hit as HitType } from 'react-instantsearch-core';
import { Highlight, Snippet } from 'react-instantsearch-dom';

import { useLocale } from '@/adapters/client';
import { StoryCard } from '@/components/StoryCards';
import type { ThemeSettings } from '@/theme-settings';
import type { ExternalStoryUrl } from '@/types';
import { getNewsroomPlaceholderColors, slugifyHeading } from '@/utils';

import { useSearchState } from './SearchStateContext';

import styles from './Hit.module.scss';

export interface Props {
    external: ExternalStoryUrl;
    hit: HitType<{ attributes: Search.IndexedStorySection; _tags: string[] }>;
    newsroom: Newsroom;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
}

export function Hit({ external, hit, newsroom, showDate, showSubtitle, storyCardVariant }: Props) {
    const { attributes: story } = hit;
    const { categories } = story;
    const localeCode = useLocale();
    const { searchState } = useSearchState();

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

    const sectionHeading = story.section_title ?? story.section_subtitle;
    const sectionHeadingAttribute = story.section_title
        ? 'attributes.section_title'
        : 'attributes.section_subtitle';
    const anchor = sectionHeading ? `#header-${slugifyHeading(sectionHeading)}` : undefined;

    const hasQuery = Boolean(searchState.query?.trim());
    const hasContentSnippet = Boolean(story.content_text);
    const showSectionSnippet = hasQuery && (Boolean(sectionHeading) || hasContentSnippet);

    const subtitle = showSectionSnippet ? (
        <span className={styles.snippet}>
            {sectionHeading && (
                <span className={styles.section}>
                    <Highlight hit={hit} attribute={sectionHeadingAttribute} tagName="mark" />
                </span>
            )}
            {sectionHeading && hasContentSnippet && <span className={styles.separator}> · </span>}
            {hasContentSnippet && (
                <Snippet hit={hit} attribute="attributes.content_text" tagName="mark" />
            )}
        </span>
    ) : (
        story.subtitle
    );

    // Force the subtitle slot on when we have a section snippet, even if the
    // theme has `show_subtitle` disabled — it is the matched context.
    const showSubtitleEffective = showSubtitle || showSectionSnippet;

    return (
        <StoryCard
            anchor={anchor}
            external={external}
            fallback={{
                image: newsroom.newsroom_logo,
                text: newsroom.name,
            }}
            layout="vertical"
            placeholder={getNewsroomPlaceholderColors(newsroom)}
            publishedAt={new Date(story.published_at * 1000).toISOString()}
            showDate={showDate}
            showSubtitle={showSubtitleEffective}
            size="medium"
            slug={story.slug}
            subtitle={subtitle}
            thumbnailImage={story.thumbnail_image}
            title={<Highlight hit={hit} attribute="attributes.title" tagName="mark" />}
            titleAsString={hit.attributes.title}
            translatedCategories={displayedCategories}
            variant={storyCardVariant}
        />
    );
}
