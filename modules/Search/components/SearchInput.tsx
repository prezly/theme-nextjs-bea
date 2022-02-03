import translations from '@prezly/themes-intl-messages';
import type { SearchBoxExposed, SearchBoxProvided } from 'react-instantsearch-core';
import { connectSearchBox } from 'react-instantsearch-dom';
import { useIntl } from 'react-intl';

import { Button, FormInput } from '@/components';
import { IconSearch } from '@/icons';

import styles from './SearchInput.module.scss';

function SearchInput({ currentRefinement, refine }: SearchBoxProvided & SearchBoxExposed) {
    const { formatMessage } = useIntl();

    return (
        <form className={styles.container} method="GET" action="/search">
            <FormInput
                label={formatMessage(translations.search.inputLabel)}
                type="search"
                name="query"
                value={currentRefinement}
                onChange={(event) => refine(event.currentTarget.value)}
                className={styles.input}
                placeholder={formatMessage(translations.search.inputHint, { inputHintExtra: '' })}
                autoComplete="off"
            />
            <Button
                type="submit"
                variation="secondary"
                className={styles.button}
                title={formatMessage(translations.search.action)}
                icon={IconSearch}
            />
        </form>
    );
}

export default connectSearchBox(SearchInput);
