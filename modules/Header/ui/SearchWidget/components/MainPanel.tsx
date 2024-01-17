import type { TranslatedCategory } from '@prezly/sdk';
import type { Search } from '@prezly/theme-kit-nextjs';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { connectStateResults } from 'react-instantsearch-dom';

import { CategoriesList } from './CategoriesList';
import { SearchResults } from './SearchResults';

import styles from './MainPanel.module.scss';

interface Props extends StateResultsProvided<Search.IndexedStory> {
    categories: TranslatedCategory[];
    isSearchPage: boolean;
    onClose: () => void;
}

export const MainPanel = connectStateResults(
    ({ categories, searchState, searchResults, isSearchPage, onClose }: Props) => {
        const isQuerySet = Boolean(searchState.query?.length);

        if (categories.length === 0 && !isQuerySet) {
            return null;
        }

        return (
            <div className={styles.container}>
                {isQuerySet ? (
                    <SearchResults
                        searchResults={searchResults}
                        query={searchState.query}
                        isSearchPage={isSearchPage}
                        onClose={onClose}
                    />
                ) : (
                    <CategoriesList categories={categories} onClose={onClose} />
                )}
            </div>
        );
    },
);

MainPanel.displayName = 'MainPanel';
