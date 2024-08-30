'use client';

import { translations } from '@prezly/theme-kit-nextjs';

import { FormattedMessage, useLocale } from '@/adapters/client';

import { useSearchState } from './SearchStateContext';

import styles from './Subtitle.module.scss';

export function Subtitle() {
    const locale = useLocale();
    const { searchState, searchResults } = useSearchState();

    const { query: searchQuery } = searchState;
    const resultsCount = searchResults ? searchResults.nbHits : 0;

    return (
        <p className={styles.subtitle}>
            {searchQuery ? (
                <FormattedMessage
                    locale={locale}
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
