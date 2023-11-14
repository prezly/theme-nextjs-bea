'use client';

import type { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { translations } from '@prezly/theme-kit-intl';
import { useCallback } from 'react';

import { FormattedMessage, useLocale } from '@/theme/client';
import { useInfiniteLoading } from '@/theme-kit/hooks';
import { http } from '@/theme-kit/http';
import { Button } from '@/ui';
import type { ListStory } from 'types';

import { StoriesList } from './StoriesList';

import styles from './InfiniteStories.module.scss';

type Props = {
    newsroomName: string;
    initialStories: ListStory[];
    pageSize: number;
    total: number;
    category?: Pick<Category, 'id'>;
};

function fetchStories(
    localeCode: Locale.Code,
    offset: number,
    limit: number,
    category: Props['category'],
) {
    return http.get<{ data: ListStory[]; total: number }>('/api/stories', {
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
}: Props) {
    const locale = useLocale();
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
