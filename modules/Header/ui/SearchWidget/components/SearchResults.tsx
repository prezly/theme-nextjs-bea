'use client';

import { translations } from '@prezly/theme-kit-nextjs';
import type { Search } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { Hits } from 'react-instantsearch-dom';

import { FormattedMessage } from '@/adapters/client';
import { ButtonLink } from '@/components/Button';

import { Hit } from './Hit';

import styles from './MainPanel.module.scss';

interface Props extends Pick<StateResultsProvided<Search.IndexedStory>, 'searchResults'> {
    query?: string;
    isSearchPage: boolean;
}

export function SearchResults({ searchResults, query, isSearchPage }: Props) {
    const totalResults = searchResults?.nbHits ?? 0;

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
                    href={`/search?query=${query}`}
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
