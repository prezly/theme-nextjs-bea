import { FunctionComponent } from 'react';
import type { SearchBoxExposed, SearchBoxProvided } from 'react-instantsearch-core';
import { connectSearchBox } from 'react-instantsearch-dom';

import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { IconEnterKey } from '@/icons';

import styles from './SearchBar.module.scss';

interface Props extends SearchBoxProvided, SearchBoxExposed {}

const SearchBar: FunctionComponent<Props> = ({ currentRefinement, refine }) => (
    <form
        className={styles.container}
        method="GET"
        action="/search"
        onSubmit={(event) => event.preventDefault()}
    >
        <div className={styles.inputWrapper}>
            <FormInput
                label="Search newsroom"
                placeholder=""
                type="search"
                name="query"
                value={currentRefinement}
                onChange={(event) => refine(event.currentTarget.value)}
                className={styles.input}
            />
            {!currentRefinement.length && (
                <span className={styles.inputHint}>
                    &nbsp;Type your search and press{' '}
                    <span className={styles.keyHint}>
                        <IconEnterKey className={styles.keyIcon} />
                        <span>Enter</span>
                    </span>{' '}
                    or click &quot;Search&quot;
                </span>
            )}
        </div>
        <Button type="submit" variation="secondary" className={styles.button}>
            Search
        </Button>
    </form>
);

export default connectSearchBox(SearchBar);
