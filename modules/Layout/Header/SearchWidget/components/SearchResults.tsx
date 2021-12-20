import { FunctionComponent } from 'react';
import { Hits } from 'react-instantsearch-dom';

import Button from '@/components/Button';

import Hit from './Hit';

import styles from './SearchResults.module.scss';

interface Props {}

const SearchResults: FunctionComponent<Props> = () => (
    <div className={styles.container}>
        <p className={styles.title}>Quick results</p>
        <Hits hitComponent={Hit} />
        <Button.Link href="/search" variation="navigation" className={styles.link}>
            Show all results
        </Button.Link>
    </div>
);

export default SearchResults;
