import classNames from 'classnames';
import { FunctionComponent } from 'react';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { Hits } from 'react-instantsearch-dom';

import Button from '@/components/Button';
import { AlgoliaStory } from 'types';

import Hit from './Hit';

import styles from './MainPanel.module.scss';

type Props = Pick<StateResultsProvided<AlgoliaStory>, 'searchResults'>;

const SearchResults: FunctionComponent<Props> = ({ searchResults }) => {
    const { nbHits: totalResults } = searchResults;

    return (
        <>
            <p className={classNames(styles.title, { [styles.titleEmpty]: !totalResults })}>
                {totalResults ? 'Quick results' : 'Nothing found! Please try another search term!'}
            </p>
            <Hits hitComponent={Hit} />
            {totalResults > 3 && (
                <Button.Link href="/search" variation="navigation" className={styles.link}>
                    Show all results
                </Button.Link>
            )}
        </>
    );
};

export default SearchResults;
