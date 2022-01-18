import translations from '@prezly/themes-intl-messages';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { connectStateResults } from 'react-instantsearch-dom';
import { useIntl } from 'react-intl';

import PageTitle from '@/components/PageTitle';
import { AlgoliaStory } from 'types';

interface Props {
    initialResultsCount: number;
}

const Title: FunctionComponent<Props & StateResultsProvided<AlgoliaStory>> = ({
    initialResultsCount,
    searchState,
    searchResults,
}) => {
    const { formatMessage } = useIntl();
    const {
        query: { query: initialSearchQuery },
    } = useRouter();

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

export default connectStateResults(Title);
