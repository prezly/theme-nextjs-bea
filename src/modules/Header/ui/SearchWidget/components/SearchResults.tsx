'use client';

import type { Newsroom } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import type { Search } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useCallback } from 'react';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { Hits } from 'react-instantsearch-dom';

import { FormattedMessage, useLocale, useRouting } from '@/adapters/client';
import { ButtonLink } from '@/components/Button';
import type { ExternalStoryUrl } from '@/types';
import { getNewsroomUuidFromHitTags, onPlainLeftClick } from '@/utils';

import { SearchHit } from './SearchHit';

import styles from './MainPanel.module.scss';

interface Props extends Pick<StateResultsProvided<Search.IndexedStory>, 'searchResults'> {
    newsrooms: Newsroom[];
    newsroomUuid: string;
    query?: string;
    isSearchPage: boolean;
    onClose?: () => void;
}

export function SearchResults({
    newsrooms,
    newsroomUuid,
    searchResults,
    query,
    isSearchPage,
    onClose,
}: Props) {
    const localeCode = useLocale();
    const { generateUrl } = useRouting();
    const totalResults = searchResults?.nbHits ?? 0;

    const Hit = useCallback<typeof SearchHit>(
        ({ hit }) => {
            const storyNewsroomUuid = getNewsroomUuidFromHitTags(hit._tags);
            const newsroom = newsrooms.find((newsroom) => newsroom.uuid === storyNewsroomUuid);

            const external =
                newsroom && newsroom.uuid !== newsroomUuid
                    ? ({
                          newsroomUrl: newsroom.url,
                          // TODO: Add the URL here when it's available in Meilisearch
                          storyUrl: '',
                      } satisfies ExternalStoryUrl)
                    : false;

            return (
                <SearchHit
                    external={external}
                    newsroom={newsroom}
                    onClick={onPlainLeftClick(onClose)}
                    hit={hit}
                />
            );
        },
        [newsroomUuid, newsrooms, onClose],
    );

    return (
        <>
            <p className={classNames(styles.title, { [styles.empty]: !totalResults })}>
                {totalResults ? (
                    <FormattedMessage locale={localeCode} for={translations.search.resultsTitle} />
                ) : (
                    <FormattedMessage locale={localeCode} for={translations.search.noResults} />
                )}
            </p>
            {/* @ts-expect-error FIXME */}
            <Hits hitComponent={Hit} />
            {totalResults > 3 && (
                <ButtonLink
                    href={`${generateUrl('search', { localeCode })}?query=${encodeURIComponent(
                        query ?? '',
                    )}`}
                    variation="navigation"
                    className={styles.link}
                    forceRefresh={isSearchPage}
                >
                    <FormattedMessage
                        locale={localeCode}
                        for={translations.search.showAllResults}
                    />
                </ButtonLink>
            )}
        </>
    );
}
