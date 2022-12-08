import type { AlgoliaStory } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { Button } from '@prezly/themes-ui-components';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { Hits } from 'react-instantsearch-dom';
import { FormattedMessage } from 'react-intl';

import Hit from './Hit';

import styles from './MainPanel.module.scss';

type Props = Pick<StateResultsProvided<AlgoliaStory>, 'searchResults'> & {
    query?: string;
};

function SearchResults({ searchResults, query }: Props) {
    const totalResults = searchResults?.nbHits ?? 0;
    const { asPath } = useRouter();
    const isOnSearchPage = asPath.startsWith('/search');

    return (
        <>
            <p className={classNames(styles.title, { [styles.empty]: !totalResults })}>
                {totalResults ? (
                    <FormattedMessage {...translations.search.resultsTitle} />
                ) : (
                    <FormattedMessage {...translations.search.noResults} />
                )}
            </p>
            <Hits hitComponent={Hit} />
            {totalResults > 3 && (
                <Button.Link
                    href={`/search?query=${query}`}
                    variation="navigation"
                    className={styles.link}
                    forceRefresh={isOnSearchPage}
                >
                    <FormattedMessage {...translations.search.showAllResults} />
                </Button.Link>
            )}
        </>
    );
}

export default SearchResults;
