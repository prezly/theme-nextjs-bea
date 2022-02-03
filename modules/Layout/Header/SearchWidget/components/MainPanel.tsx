import type { AlgoliaStory } from '@prezly/theme-kit-nextjs';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { connectStateResults } from 'react-instantsearch-dom';

import CategoriesList from './CategoriesList';
import SearchResults from './SearchResults';

import styles from './MainPanel.module.scss';

function MainPanel({ searchState, searchResults }: StateResultsProvided<AlgoliaStory>) {
    const isQuerySet = Boolean(searchState.query?.length);

    return (
        <div className={styles.container}>
            {isQuerySet ? (
                <SearchResults searchResults={searchResults} query={searchState.query} />
            ) : (
                <CategoriesList />
            )}
        </div>
    );
}

export default connectStateResults(MainPanel);
