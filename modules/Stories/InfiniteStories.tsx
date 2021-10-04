import type { FunctionComponent } from 'react';
import type { Story } from '@prezly/sdk';
import { Category } from '@prezly/sdk/dist/types';
import { PaginationProps } from 'types';
import { useInfiniteStoriesLoading } from '@/hooks/useInfiniteStoriesLoading';
import LoadMore from './LoadMore';
import StoriesList from './StoriesList';

type Props = {
    initialStories: Story[];
    pagination: PaginationProps;
    category?: Category;
};

const InfiniteStories: FunctionComponent<Props> = ({ initialStories, pagination, category }) => {
    const {
        canLoadMore,
        displayedStories,
        isLoading,
        loadMoreStories,
    } = useInfiniteStoriesLoading(initialStories, pagination, category);

    return (
        <div>
            <StoriesList stories={displayedStories} />

            {/* Infinite loading with a button */}
            {canLoadMore && (
                <LoadMore isLoading={isLoading} onLoadMore={loadMoreStories} />
            )}
        </div>
    );
};

InfiniteStories.defaultProps = {
    category: undefined,
};

export default InfiniteStories;
