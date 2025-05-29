'use client';

import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations, useInfiniteLoading, useIntl } from '@prezly/theme-kit-nextjs';
import { useCallback } from 'react';

import { FormattedMessage, http, useLocale } from '@/adapters/client';
import { Button } from '@/components/Button';
import { PageTitle } from '@/components/PageTitle';
import type { ThemeSettings } from '@/theme-settings';
import type { ListStory } from '@/types';

import { StoriesList } from '../InfiniteStories';

import { NewsroomLogo } from './NewsroomLogo';

import styles from './InfiniteHubStories.module.scss';

type Props = {
    initialStories: ListStory[];
    layout: ThemeSettings['layout'];
    newsroomName: string;
    newsroomUuid: string;
    newsrooms: Newsroom[];
    pageSize: number;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
    total: number;
};

function fetchStories(props: { localeCode: Locale.Code; offset: number; limit: number }) {
    const { localeCode, offset, limit } = props;
    return http.get<{ data: ListStory[]; total: number }>('/api/hub-stories', {
        limit,
        offset,
        locale: localeCode,
    });
}

export function InfiniteHubStories({
    initialStories,
    layout,
    newsroomName,
    newsroomUuid,
    newsrooms,
    pageSize,
    showDate,
    showSubtitle,
    storyCardVariant,
    total,
}: Props) {
    const locale = useLocale();
    const { formatMessage } = useIntl();
    const includedNewsrooms = newsrooms.filter(({ uuid }) => uuid !== newsroomUuid);

    const { load, loading, data, done } = useInfiniteLoading(
        useCallback(
            (offset) =>
                fetchStories({
                    localeCode: locale,
                    offset,
                    limit: pageSize,
                }),
            [locale, pageSize],
        ),
        { data: initialStories, total },
    );

    return (
        <div>
            <div className={styles.newsrooms} data-count={includedNewsrooms.length}>
                {includedNewsrooms.map((newsroom) => (
                    <NewsroomLogo key={newsroom.uuid} newsroom={newsroom} />
                ))}
            </div>
            {data.length > 0 && (
                <PageTitle
                    className={styles.title}
                    title={formatMessage(translations.homepage.latestStories)}
                />
            )}
            <StoriesList
                fullWidthFeaturedStory={false}
                isCategoryList
                layout={layout}
                newsroomName={newsroomName}
                newsrooms={newsrooms}
                newsroomUuid={newsroomUuid}
                showDate={showDate}
                showSubtitle={showSubtitle}
                stories={data}
                storyCardVariant={storyCardVariant}
                withEmptyState={false}
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
