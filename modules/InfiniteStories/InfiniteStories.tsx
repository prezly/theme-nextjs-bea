'use client';

import type { Category, Story } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations, useInfiniteLoading } from '@prezly/theme-kit-nextjs';
import { useCallback } from 'react';

import { FormattedMessage, http, useLocale } from '@/adapters/client';
import { Button } from '@/components/Button';
import type { ListStory } from 'types';

import { StoriesList } from './StoriesList';

import styles from './InfiniteStories.module.scss';

type Props = {
    newsroomName: string;
    initialStories: ListStory[];
    pageSize: number;
    total: number;
    category?: Pick<Category, 'id'>;
    categories?: Category[];
    isCategoryList?: boolean;
    excludedStoryUuids?: Story['uuid'][];
    showDate: boolean;
    showSubtitle: boolean;
};

function fetchStories(
    localeCode: Locale.Code,
    offset: number,
    limit: number,
    category: Props['category'],
    excludedStoryUuids: Story['uuid'][] | undefined,
) {
    return http.get<{ data: ListStory[]; total: number }>('/api/stories', {
        limit,
        offset,
        locale: localeCode,
        category: category?.id,
        query: excludedStoryUuids && JSON.stringify({ uuid: { $nin: excludedStoryUuids } }),
    });
}

export function InfiniteStories({
    newsroomName,
    initialStories,
    pageSize,
    total,
    category,
    categories,
    isCategoryList,
    excludedStoryUuids,
    showDate,
    showSubtitle,
}: Props) {
    const locale = useLocale();
    const { load, loading, data, done } = useInfiniteLoading(
        useCallback(
            (offset) => fetchStories(locale, offset, pageSize, category, excludedStoryUuids),
            [category, excludedStoryUuids, locale, pageSize],
        ),
        { data: initialStories, total },
    );

    return (
        <div>
            <StoriesList
                newsroomName={newsroomName}
                stories={data}
                category={category}
                categories={categories}
                isCategoryList={isCategoryList}
                showDate={showDate}
                showSubtitle={showSubtitle}
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
