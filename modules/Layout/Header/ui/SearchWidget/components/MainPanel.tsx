import type { AlgoliaStory } from '@prezly/theme-kit-core';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { connectStateResults } from 'react-instantsearch-dom';

import type { DisplayedCategory } from '@/ui';

import { CategoriesList } from './CategoriesList';
import { SearchResults } from './SearchResults';

import styles from './MainPanel.module.scss';

interface Props extends StateResultsProvided<AlgoliaStory> {
    categories: DisplayedCategory[];
}

export const MainPanel = connectStateResults(
    ({ categories, searchState, searchResults }: Props) => {
        const isQuerySet = Boolean(searchState.query?.length);

        if (categories.length === 0 && !isQuerySet) {
            return null;
        }

        return (
            <div className={styles.container}>
                {isQuerySet ? (
                    <SearchResults searchResults={searchResults} query={searchState.query} />
                ) : (
                    <CategoriesList categories={categories} />
                )}
            </div>
        );
    },
);

MainPanel.displayName = 'MainPanel';
