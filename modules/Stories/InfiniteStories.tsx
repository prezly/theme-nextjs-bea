import { Category } from '@prezly/sdk/dist/types';
import type { FunctionComponent } from 'react';

import Button from '@/components/Button';
import { useInfiniteStoriesLoading } from '@/hooks/useInfiniteStoriesLoading';
import { PaginationProps } from 'types';

import type { StoryWithImage } from './lib/types';
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
            {canLoadMore && (
                <Button
                    variation="secondary"
                    onClick={loadMoreStories}
                    isLoading={isLoading}
                    className={styles.loadMore}
                >
                    {isLoading ? 'Loading...' : 'Load more'}
                </Button>
            )}
        </div>
    );
};

export default InfiniteStories;
