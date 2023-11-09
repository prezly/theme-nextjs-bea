'use client';

import type { Category, ExtendedStory } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-intl';
import { useCallback } from 'react';

import { useInfiniteLoading } from '@/theme-kit/hooks';
import { http } from '@/theme-kit/http';
import { FormattedMessage } from '@/theme-kit/intl/client';
import { Button } from '@/ui';
import type { StoryWithImage } from 'types';

import { StoriesList } from './StoriesList';

import styles from './InfiniteStories.module.scss';

type Props = {
    newsroomName: string;
    initialStories: StoryWithImage[];
    pageSize: number;
    total: number;
    category?: Category;
    showDates: boolean;
    showSubtitles: boolean;
};

function fetchStories(offset: number, limit: number) {
    return http.get<{ data: ExtendedStory[]; total: number }>('/api/stories', {
        limit,
        offset,
    });
}

export function InfiniteStories({
    newsroomName,
    initialStories,
    pageSize,
    total,
    category,
    showDates,
    showSubtitles,
}: Props) {
    const { load, loading, data, done } = useInfiniteLoading(
        useCallback((offset) => fetchStories(offset, pageSize), [pageSize]),
        { data: initialStories, total },
    );

    return (
        <div>
            <StoriesList
                newsoomName={newsroomName}
                stories={data}
                isCategoryList={Boolean(category)}
                showDates={showDates}
                showSubtitles={showSubtitles}
            />

            {!done && (
                <Button
                    variation="secondary"
                    onClick={load}
                    loading={loading}
                    className={styles.loadMore}
                >
                    {loading ? (
                        <FormattedMessage for={translations.misc.stateLoading} />
                    ) : (
                        <FormattedMessage for={translations.actions.loadMore} />
                    )}
                </Button>
            )}
        </div>
    );
}
