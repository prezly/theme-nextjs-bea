'use client';

import { translations } from '@prezly/theme-kit-nextjs';
import type { Search } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { useCallback } from 'react';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { Hits } from 'react-instantsearch-dom';

import { FormattedMessage, useLocale, useRouting } from '@/adapters/client';
import { ButtonLink } from '@/components/Button';

import { SearchHit } from './SearchHit';

import styles from './MainPanel.module.scss';

interface Props extends Pick<StateResultsProvided<Search.IndexedStory>, 'searchResults'> {
    query?: string;
    isSearchPage: boolean;
    onClose?: () => void;
}

export function SearchResults({ searchResults, query, isSearchPage, onClose }: Props) {
    const localeCode = useLocale();
    const { generateUrl } = useRouting();
    const totalResults = searchResults?.nbHits ?? 0;

    const Hit = useCallback<typeof SearchHit>(
        ({ hit }) => <SearchHit onClick={onClose} hit={hit} />,
        [onClose],
    );

    return (
        <>
            <p className={classNames(styles.title, { [styles.empty]: !totalResults })}>
                {totalResults ? (
                    <FormattedMessage for={translations.search.resultsTitle} />
                ) : (
                    <FormattedMessage for={translations.search.noResults} />
                )}
            </p>
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
                    <FormattedMessage for={translations.search.showAllResults} />
                </ButtonLink>
            )}
        </>
    );
}
