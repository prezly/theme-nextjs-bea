import { Category } from '@prezly/sdk/dist/types';
import type { FunctionComponent } from 'react';

import { useInfiniteStoriesLoading } from '@/hooks/useInfiniteStoriesLoading';
import { PaginationProps } from 'types';

import type { StoryWithImage } from './lib/types';
import LoadMore from './LoadMore';
import StoriesList from './StoriesList';

import styles from './InfiniteStories.module.scss';

type Props = {
    initialStories: StoryWithImage[];
    pagination: PaginationProps;
    category?: Category;
};

const InfiniteStories: FunctionComponent<Props> = ({ initialStories, pagination, category }) => {
    const { canLoadMore, displayedStories, isLoading, loadMoreStories } = useInfiniteStoriesLoading(
        initialStories,
        pagination,
        category,
    );

    return (
        <div className={styles.container}>
            <StoriesList stories={displayedStories} isCategoryList={Boolean(category)} />

            {/* Infinite loading with a button */}
            {canLoadMore && <LoadMore isLoading={isLoading} onLoadMore={loadMoreStories} />}
        </div>
    );
};

export default InfiniteStories;
