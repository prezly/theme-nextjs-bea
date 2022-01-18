import { FunctionComponent } from 'react';
import type { StateResultsProvided } from 'react-instantsearch-core';
import { connectStateResults } from 'react-instantsearch-dom';

import InfiniteStories from '@/modules/InfiniteStories';
import { PaginationProps, StoryWithImage } from 'types';

import Results from './Results';

interface Props {
    initialStories: StoryWithImage[];
    pagination: PaginationProps;
}

const MainPanel: FunctionComponent<Props & StateResultsProvided> = ({
    initialStories,
    pagination,
    searchState,
}) => {
    // TODO: Add loading state

    if (searchState.query?.length) {
        return <Results />;
    }

    return (
        <InfiniteStories initialStories={initialStories} pagination={pagination} isSearchResults />
    );
};

export default connectStateResults(MainPanel);
