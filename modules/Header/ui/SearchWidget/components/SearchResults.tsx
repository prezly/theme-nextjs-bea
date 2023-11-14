'use client';

import type { AlgoliaStory } from '@prezly/theme-kit-core';
import { translations } from '@prezly/theme-kit-intl';
import classNames from 'classnames';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { Hits } from 'react-instantsearch-dom';

import { ButtonLink } from '@/components/Button';
import { FormattedMessage } from '@/theme/client';

import { Hit } from './Hit';

import styles from './MainPanel.module.scss';

interface Props extends Pick<StateResultsProvided<AlgoliaStory>, 'searchResults'> {
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
