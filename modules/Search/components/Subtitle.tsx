import translations from '@prezly/themes-intl-messages';
import { FormattedMessage } from 'react-intl';

import { useAlgoliaState } from './AlgoliaStateContext';

import styles from './Subtitle.module.scss';

function Subtitle() {
    const { searchState, searchResults } = useAlgoliaState();

    const { query: searchQuery } = searchState;
    const resultsCount = searchResults ? searchResults.nbHits : 0;

    return (
        <p className={styles.subtitle}>
            {searchQuery ? (
                <FormattedMessage
                    {...translations.search.fullResultsSubTitle}
                    values={{
                        resultsCount: <b>{resultsCount}</b>,
                        searchQuery: (
                            <>
                                &quot;<b>{searchQuery}</b>&quot;
                            </>
                        ),
                    }}
                />
            ) : undefined}
        </p>
    );
}

export default Subtitle;
