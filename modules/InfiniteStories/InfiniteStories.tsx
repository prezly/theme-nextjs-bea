'use client';

import type { Category, Story } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations, useInfiniteLoading } from '@prezly/theme-kit-nextjs';
import { useCallback } from 'react';

import { FormattedMessage, http, useLocale } from '@/adapters/client';
import { Button } from '@/components/Button';
import type { ThemeSettings } from '@/theme-settings';
import type { ListStory } from '@/types';

import { StoriesList } from './StoriesList';

import styles from './InfiniteStories.module.scss';

type Props = {
    categories?: Category[];
    category?: Pick<Category, 'id'>;
    tag?: string;
    excludedStoryUuids?: Story['uuid'][];
    fullWidthFeaturedStory?: boolean;
    initialStories: ListStory[];
    isCategoryList?: boolean;
    layout: ThemeSettings['layout'];
    newsroomName: string;
    pageSize: number;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
    total: number;
};

function fetchStories(props: {
    localeCode: Locale.Code;
    offset: number;
    limit: number;
    category: Props['category'];
    excludedStoryUuids: Story['uuid'][] | undefined;
    tag: Props['tag'];
}) {
    const { localeCode, offset, limit, category, excludedStoryUuids, tag } = props;
    return http.get<{ data: ListStory[]; total: number }>('/api/stories', {
        limit,
        offset,
        locale: localeCode,
        category: category?.id,
        query: excludedStoryUuids && JSON.stringify({ uuid: { $nin: excludedStoryUuids } }),
        tag,
    });
}

export function InfiniteStories({
    categories,
    category,
    tag,
    excludedStoryUuids,
    fullWidthFeaturedStory = false,
    initialStories,
    isCategoryList,
    layout,
    newsroomName,
    pageSize,
    showDate,
    showSubtitle,
    storyCardVariant,
    total,
}: Props) {
    const locale = useLocale();
    const { load, loading, data, done } = useInfiniteLoading(
        useCallback(
            (offset) =>
                fetchStories({
                    localeCode: locale,
                    offset,
                    limit: pageSize,
                    category,
                    excludedStoryUuids,
                    tag,
                }),
            [category, excludedStoryUuids, locale, pageSize, tag],
        ),
        { data: initialStories, total },
    );

    return (
        <div>
            <StoriesList
                categories={categories}
                category={category}
                fullWidthFeaturedStory={fullWidthFeaturedStory}
                isCategoryList={isCategoryList}
                layout={layout}
                newsroomName={newsroomName}
                showDate={showDate}
                showSubtitle={showSubtitle}
                stories={data}
                storyCardVariant={storyCardVariant}
            />

            {!done && (
                <Button
                    variation="secondary"
                    onClick={load}
                    loading={loading}
                    className={styles.loadMore}
                >
                    {loading ? (
                        <FormattedMessage locale={locale} for={translations.misc.stateLoading} />
                    ) : (
                        <FormattedMessage locale={locale} for={translations.actions.loadMore} />
                    )}
                </Button>
            )}
        </div>
    );
}
