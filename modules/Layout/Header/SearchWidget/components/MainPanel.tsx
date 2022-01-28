import type { AlgoliaStory } from '@prezly/theme-kit-nextjs';
import { FunctionComponent } from 'react';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { connectStateResults } from 'react-instantsearch-dom';

import CategoriesList from './CategoriesList';
import SearchResults from './SearchResults';

import styles from './MainPanel.module.scss';

const MainPanel: FunctionComponent<StateResultsProvided<AlgoliaStory>> = ({
    searchState,
    searchResults,
}) => {
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
};

export default connectStateResults(MainPanel);
