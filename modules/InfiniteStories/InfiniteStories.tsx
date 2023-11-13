'use client';

import type { Category, ExtendedStory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { translations } from '@prezly/theme-kit-intl';
import { useCallback } from 'react';

import { FormattedMessage, useIntl } from '@/theme/client';
import { useInfiniteLoading } from '@/theme-kit/hooks';
import { http } from '@/theme-kit/http';
import { Button } from '@/ui';
import type { StoryWithImage } from 'types';

import { StoriesList } from './StoriesList';

import styles from './InfiniteStories.module.scss';

type Props = {
    newsroomName: string;
    initialStories: StoryWithImage[];
    pageSize: number;
    total: number;
    category?: Pick<Category, 'id'>;
    showDates: boolean;
    showSubtitles: boolean;
};

function fetchStories(
    localeCode: Locale.Code,
    offset: number,
    limit: number,
    category: Props['category'],
) {
    return http.get<{ data: ExtendedStory[]; total: number }>('/api/stories', {
        limit,
        offset,
        locale: localeCode,
        category: category?.id,
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
    const { locale } = useIntl();
    const { load, loading, data, done } = useInfiniteLoading(
        useCallback(
            (offset) => fetchStories(locale, offset, pageSize, category),
            [locale, pageSize, category],
        ),
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
