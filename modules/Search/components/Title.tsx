import translations from '@prezly/themes-intl-messages';
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';

import { PageTitle } from '@/components';

import { useAlgoliaState } from './AlgoliaStateContext';

import styles from './Title.module.scss';

function Title() {
    const { formatMessage } = useIntl();
    const { searchState, searchResults } = useAlgoliaState();

    const { query: searchQuery } = searchState;
    const resultsCount = searchResults ? searchResults.nbHits : 0;

    return (
        <PageTitle
            title={
                searchQuery
                    ? formatMessage(translations.search.fullResultsTitle)
                    : formatMessage(translations.search.title)
            }
            subtitle={
                searchQuery ? (
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
                ) : undefined
            }
            className={classNames({
                [styles.empty]: !searchQuery,
            })}
        />
    );
}

export default Title;
