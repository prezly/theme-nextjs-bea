import translations from '@prezly/themes-intl-messages';
import classNames from 'classnames';
import { FunctionComponent } from 'react';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { Hits } from 'react-instantsearch-dom';
import { FormattedMessage } from 'react-intl';

import { AlgoliaStory } from 'types';

import Hit from './Hit';

import styles from './MainPanel.module.scss';

type Props = Pick<StateResultsProvided<AlgoliaStory>, 'searchResults'>;

const SearchResults: FunctionComponent<Props> = ({ searchResults }) => {
    const { nbHits: totalResults } = searchResults;

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
            {/* TODO: This is blocked by https://linear.app/prezly/issue/TITS-4995/dedicated-search-page-implement-base-page-with-search-results */}
            {/* {totalResults > 3 && (
                <Button.Link href="/search" variation="navigation" className={styles.link}>
                    <FormattedMessage {...translations.search.showAllResults} />
                </Button.Link>
            )} */}
        </>
    );
};

export default SearchResults;
