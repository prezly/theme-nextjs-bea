import translations from '@prezly/themes-intl-messages';
import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import PageTitle from '@/components/PageTitle';

import { useAlgoliaState } from './AlgoliaStateContext';

const Title: FunctionComponent = () => {
    const { formatMessage } = useIntl();
    const { searchState, searchResults } = useAlgoliaState();

    const { query: searchQuery } = searchState;
    const resultsCount = searchResults ? searchResults.nbHits : 0;

    return (
        <PageTitle
            title={searchQuery ? 'Search results' : formatMessage(translations.search.title)}
            subtitle={
                searchQuery ? (
                    <>
                        We found <b>{resultsCount}</b> results for &quot;<b>{searchQuery}</b>&quot;
                    </>
                ) : undefined
            }
        />
    );
};

export default Title;
