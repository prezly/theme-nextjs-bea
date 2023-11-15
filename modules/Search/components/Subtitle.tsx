'use client';

import { translations } from '@prezly/theme-kit-nextjs';

import { FormattedMessage } from '@/theme/client';

import { useAlgoliaState } from './AlgoliaStateContext';

import styles from './Subtitle.module.scss';

export function Subtitle() {
    const { searchState, searchResults } = useAlgoliaState();

    const { query: searchQuery } = searchState;
    const resultsCount = searchResults ? searchResults.nbHits : 0;

    return (
        <p className={styles.subtitle}>
            {searchQuery ? (
                <FormattedMessage
                    for={translations.search.fullResultsSubTitle}
                    values={{
                        resultsCount: <b>{resultsCount}</b>,
                        searchQuery: (
                            <>
                                &quot;<b>{searchQuery}</b>&quot;
                            </>
                        ),
                    }}
                />
            ) : undefined}
        </p>
    );
}
