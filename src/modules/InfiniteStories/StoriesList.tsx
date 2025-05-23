'use client';

import type { Newsroom } from '@prezly/sdk';
import { Category } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useMemo } from 'react';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { StaggeredLayout } from '@/components/StaggeredLayout';
import { HighlightedStoryCard, StoryCard } from '@/components/StoryCards';
import type { ThemeSettings } from '@/theme-settings';
import type { ListStory } from '@/types';
import { getNewsroomPlaceholderColors } from '@/utils';

import { useStoryCardLayout } from './lib';
import { CategoriesFilters } from './ui';

import Illustration from '@/public/images/no-stories-illustration.svg';

import styles from './StoriesList.module.scss';

type Props = {
    categories?: Category[];
    category?: Pick<Category, 'id'>;
    fullWidthFeaturedStory: boolean;
    isCategoryList?: boolean;
    layout?: 'grid' | 'masonry';
    newsroomName: string;
    newsrooms: Newsroom[];
    newsroomUuid: string;
    showDate: boolean;
    showSubtitle: boolean;
    stories: ListStory[];
    storyCardVariant: ThemeSettings['story_card_variant'];
};

export function StoriesList({
    categories = [],
    category,
    fullWidthFeaturedStory,
    isCategoryList = false,
    layout = 'grid',
    newsroomName,
    newsrooms,
    newsroomUuid,
    showDate,
    showSubtitle,
    stories,
    storyCardVariant,
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

    const getStoryCardSize = useStoryCardLayout(isCategoryList);

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
                <div>
                    {highlightedStories.map((story) => {
                        const newsroom = newsrooms.find(({ uuid }) => uuid === newsroomUuid);

                        return (
                            <HighlightedStoryCard
                                key={story.uuid}
                                fullWidth={fullWidthFeaturedStory}
                                newsroomName={newsroomName}
                                newsroomLogo={newsroom?.newsroom_logo ?? null}
                                rounded={storyCardVariant === 'boxed'}
                                showDate={showDate}
                                showSubtitle={showSubtitle}
                                story={story}
                            />
                        );
                    })}
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
                <div
                    className={classNames(styles.storiesContainer, {
                        [styles.stacked]: !isCategoryList,
                    })}
                >
                    {restStories.map((story, index) => {
                        const isExternal = story.newsroom.uuid !== newsroomUuid;
                        const newsroom = newsrooms.find(
                            (newsroom) => newsroom.uuid === story.newsroom.uuid,
                        );

                        return (
                            <StoryCard
                                key={story.uuid}
                                fallback={{
                                    image: newsroom?.newsroom_logo ?? null,
                                    text: newsroom?.name ?? '',
                                }}
                                forceAspectRatio
                                isExternal={
                                    isExternal
                                        ? {
                                              newsroomUrl: story.newsroom.url,
                                              storyUrl: story.links.newsroom_view!,
                                          }
                                        : false
                                }
                                layout="vertical"
                                placeholder={getNewsroomPlaceholderColors(newsroom)}
                                publishedAt={story.published_at}
                                showDate={showDate}
                                showSubtitle={showSubtitle}
                                size={getStoryCardSize(index)}
                                slug={story.slug}
                                subtitle={story.subtitle}
                                thumbnailImage={story.thumbnail_image}
                                title={story.title}
                                titleAsString={story.title}
                                translatedCategories={Category.translations(
                                    story.categories,
                                    locale,
                                )}
                                variant={storyCardVariant}
                            />
                        );
                    })}
                </div>
            )}
            {restStories.length > 0 && layout === 'masonry' && (
                <StaggeredLayout className={styles.staggered}>
                    {restStories.map((story) => {
                        const isExternal = story.newsroom.uuid !== newsroomUuid;
                        const newsroom = newsrooms.find(
                            (newsroom) => newsroom.uuid === story.newsroom.uuid,
                        );

                        return (
                            <StoryCard
                                key={story.uuid}
                                className={styles.card}
                                fallback={{
                                    image: newsroom?.newsroom_logo ?? null,
                                    text: newsroom?.name ?? '',
                                }}
                                isExternal={
                                    isExternal
                                        ? {
                                              newsroomUrl: story.newsroom.url,
                                              storyUrl: story.links.newsroom_view!,
                                          }
                                        : false
                                }
                                layout="vertical"
                                placeholder={getNewsroomPlaceholderColors(newsroom)}
                                publishedAt={story.published_at}
                                showDate={showDate}
                                showSubtitle={showSubtitle}
                                size="medium"
                                slug={story.slug}
                                subtitle={story.subtitle}
                                thumbnailImage={story.thumbnail_image}
                                title={story.title}
                                titleAsString={story.title}
                                translatedCategories={Category.translations(
                                    story.categories,
                                    locale,
                                )}
                                variant={storyCardVariant}
                                withStaticImage
                            />
                        );
                    })}
                </StaggeredLayout>
            )}
        </>
    );
}
