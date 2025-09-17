'use client';

import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations, useInfiniteLoading } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useCallback } from 'react';

import { FormattedMessage, http, useLocale } from '@/adapters/client';
import { Button } from '@/components/Button';
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
    const includedNewsrooms = newsrooms.filter(({ uuid }) => uuid !== newsroomUuid);

    const {
        load,
        loading,
        data: stories,
        done,
    } = useInfiniteLoading(
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

    function getColumnsClassName() {
        if (includedNewsrooms.length % 2 === 0) {
            return styles.four;
        }

        if (includedNewsrooms.length === 2) {
            return styles.two;
        }

        if (includedNewsrooms.length % 3 === 0) {
            return styles.three;
        }

        if (includedNewsrooms.length % 5 === 0) {
            return styles.five;
        }

        if (includedNewsrooms.length > 8) {
            return styles.six;
        }

        return undefined;
    }

    return (
        <div>
            <div
                className={classNames(styles.newsrooms, getColumnsClassName(), {
                    [styles.withMargin]: stories.length > 0,
                })}
            >
                {includedNewsrooms.map((newsroom) => (
                    <NewsroomLogo key={newsroom.uuid} newsroom={newsroom} />
                ))}
            </div>
            <StoriesList
                fullWidthFeaturedStory={false}
                isCategoryList
                layout={layout}
                newsroomName={newsroomName}
                newsrooms={newsrooms}
                newsroomUuid={newsroomUuid}
                showDate={showDate}
                showSubtitle={showSubtitle}
                stories={stories}
                storyCardVariant={storyCardVariant}
                withEmptyState={false}
                withPageTitle
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
