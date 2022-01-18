import translations from '@prezly/themes-intl-messages';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import PageTitle from '@/components/PageTitle';

import { useAlgoliaState } from './AlgoliaStateContext';

interface Props {
    initialResultsCount: number;
}

const Title: FunctionComponent<Props> = ({ initialResultsCount }) => {
    const { formatMessage } = useIntl();
    const {
        query: { query: initialSearchQuery },
    } = useRouter();
    const { searchState, searchResults } = useAlgoliaState();

    const searchQuery =
        searchState.query ||
        (typeof initialSearchQuery === 'string' ? initialSearchQuery : undefined);
    const isLiveSearch = Boolean(searchState.query?.length);
    const resultsCount = isLiveSearch ? searchResults.nbHits : initialResultsCount;

    return (
        <PageTitle
            title={searchQuery ? 'Search results' : formatMessage(translations.search.title)}
            subtitle={
                searchQuery ? `We found ${resultsCount} results for "${searchQuery}"` : undefined
            }
        />
    );
};

export default Title;
