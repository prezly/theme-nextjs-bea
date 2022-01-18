import { FunctionComponent } from 'react';

import InfiniteStories from '@/modules/InfiniteStories';
import { PaginationProps, StoryWithImage } from 'types';

import { useAlgoliaState } from './AlgoliaStateContext';
import Results from './Results';

interface Props {
    initialStories: StoryWithImage[];
    pagination: PaginationProps;
}

const MainPanel: FunctionComponent<Props> = ({ initialStories, pagination }) => {
    const {
        searchState: { query },
    } = useAlgoliaState();

    // TODO: Add loading state

    if (query?.length) {
        return <Results />;
    }

    return (
        <InfiniteStories initialStories={initialStories} pagination={pagination} isSearchResults />
    );
};

export default MainPanel;
