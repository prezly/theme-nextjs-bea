'use client';

import type { AlgoliaStory } from '@prezly/theme-kit-core';
import { translations } from '@prezly/theme-kit-intl';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { Hits } from 'react-instantsearch-dom';

import { FormattedMessage } from '@/theme-kit/intl/client';
import { ButtonLink } from '@/ui';

import { Hit } from './Hit';

import styles from './MainPanel.module.scss';

interface Props extends Pick<StateResultsProvided<AlgoliaStory>, 'searchResults'> {
    query?: string;
}

export function SearchResults({ searchResults, query }: Props) {
    const totalResults = searchResults?.nbHits ?? 0;
    const pathname = usePathname();
    const isOnSearchPage = pathname.startsWith('/search'); // FIXME: Use a more reliable way of detecting search page

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
                    forceRefresh={isOnSearchPage}
                >
                    <FormattedMessage for={translations.search.showAllResults} />
                </ButtonLink>
            )}
        </>
    );
}
