'use client';

import type { Newsroom } from '@prezly/sdk';
import { Category } from '@prezly/sdk';
import { translations, useIntl } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useMemo } from 'react';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { PageTitle } from '@/components/PageTitle';
import { StaggeredLayout } from '@/components/StaggeredLayout';
import { HighlightedStoryCard, PlaceholderStoryCard, StoryCard } from '@/components/StoryCards';
import type { ThemeSettings } from '@/theme-settings';
import type { ListStory } from '@/types';
import { getNewsroomPlaceholderColors, isPreviewActive } from '@/utils';

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
    withEmptyState?: boolean;
    withPageTitle?: boolean;
};

const PLACEHOLDER_STORIES = [
    {
        title: 'Write your first Prezly story',
        description:
            'Add multimedia attachments and content from social platforms directly into your stories. Use templates to speed up the creation process.',
        isPlaceholder: true,
    },
    {
        title: 'Create a press kit with rich content',
        description:
            'Embed a podcast. Create a press kit. Share an investor report. Write whatever story you need to tell, however you want to tell it.',
        isPlaceholder: true,
    },
    {
        title: 'Use AI to translate your story fast',
        description:
            'Go multilingual with your newsroom - more than 50 locales supported with minimal effort.',
        isPlaceholder: true,
    },
];

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
    withEmptyState = true,
    withPageTitle,
}: Props) {
    const locale = useLocale();
    const { formatMessage } = useIntl();
    const hasCategories = categories.length > 0;
    const hasStories = stories.length > 0;
    const isPreview = isPreviewActive();
    const totalStories = newsrooms.reduce((total, newsroom) => newsroom.stories_number + total, 0);

    const [highlightedStories, restStories] = useMemo(() => {
        if (isPreview && totalStories < 3) {
            if (isCategoryList) {
                const placeholders = PLACEHOLDER_STORIES
                    // Do not show the "Write your first Prezly story" placeholder in this case.
                    .slice(1)
                    // Show at least 3 items: append placeholders if not enough stories.
                    .slice(0, 3 - stories.length);

                return [[], [...stories, ...placeholders]];
            }

            if (stories.length === 0) {
                const highlighted = PLACEHOLDER_STORIES.slice(0, 1);
                const rest = PLACEHOLDER_STORIES.slice(1);

                return [highlighted, rest];
            }

            const placeholders = PLACEHOLDER_STORIES
                // Do not show the "Write your first Prezly story" placeholder in this case.
                .slice(1)
                // Show at least 3 items: append placeholders if not enough stories.
                .slice(0, 3 - stories.length);

            const highlighted = stories.slice(0, 1);
            const rest = [...stories.slice(1), ...placeholders];

            return [highlighted, rest];
        }

        if (isCategoryList) {
            return [[], stories];
        }

        // When there are only two stories and no categories to filter,
        // they should be both displayed as highlighted
        if (stories.length === 2 && !hasCategories) {
            return [stories, []];
        }

        return [stories.slice(0, 1), stories.slice(1)];
    }, [hasCategories, isCategoryList, stories, isPreview, totalStories]);

    const getStoryCardSize = useStoryCardLayout(isCategoryList);

    if (withEmptyState && !highlightedStories.length && !restStories.length) {
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

                        if ('isPlaceholder' in story) {
                            return (
                                <PlaceholderStoryCard
                                    description={story.description}
                                    title={story.title}
                                    isHighlight
                                    hasStories={hasStories}
                                />
                            );
                        }

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
            {withPageTitle && (
                <PageTitle
                    className={classNames(styles.pageTitle, {
                        // We want to hide the page title for regular users, but keep it
                        // for the screen readers.
                        [styles.aria]: isCategoryList ? !hasStories : !hasCategories,
                    })}
                    title={formatMessage(translations.homepage.latestStories)}
                />
            )}
            {hasCategories && (
                <CategoriesFilters
                    activeCategory={category}
                    categories={categories}
                    className={styles.filters}
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
                        if ('isPlaceholder' in story) {
                            return (
                                <PlaceholderStoryCard
                                    description={story.description}
                                    title={story.title}
                                    hasStories={hasStories}
                                    isCategoryPage={isCategoryList}
                                />
                            );
                        }

                        const newsroom = newsrooms.find(
                            (newsroom) => newsroom.uuid === story.newsroom.uuid,
                        );

                        return (
                            <StoryCard
                                key={story.uuid}
                                external={
                                    story.newsroom.uuid !== newsroomUuid
                                        ? {
                                              newsroomUrl: story.newsroom.url,
                                              storyUrl: story.links.newsroom_view!,
                                          }
                                        : false
                                }
                                fallback={{
                                    image: newsroom?.newsroom_logo ?? null,
                                    text: newsroom?.name ?? '',
                                }}
                                forceAspectRatio
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
                        if ('isPlaceholder' in story) {
                            return (
                                <PlaceholderStoryCard
                                    description={story.description}
                                    title={story.title}
                                    hasStories={hasStories}
                                    isCategoryPage={isCategoryList}
                                />
                            );
                        }

                        const newsroom = newsrooms.find(
                            (newsroom) => newsroom.uuid === story.newsroom.uuid,
                        );

                        return (
                            <StoryCard
                                key={story.uuid}
                                className={styles.card}
                                external={
                                    story.newsroom.uuid !== newsroomUuid
                                        ? {
                                              newsroomUrl: story.newsroom.url,
                                              storyUrl: story.links.newsroom_view!,
                                          }
                                        : false
                                }
                                fallback={{
                                    image: newsroom?.newsroom_logo ?? null,
                                    text: newsroom?.name ?? '',
                                }}
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
