import type { FunctionComponent } from 'react';
import Link from 'next/link';
import type { Story } from '@prezly/sdk';
import { Category } from '@prezly/sdk/dist/types';
import { PaginationProps } from 'types';
import { useInfiniteStoriesLoading } from '@/hooks/useInfiniteStoriesLoading';
import Pagination from './Pagination';

type Props = {
    stories: Story[];
    pagination: PaginationProps;
    category?: Category;
};

/**
 * This component contains code for both Infinite Loading and classic Pagination.
 * You should choose one or another in your theme.
 */
const Stories: FunctionComponent<Props> = ({ stories, pagination, category }) => {
    // This enables infinite loading, but only when classic query pagination is not active
    const {
        canLoadMore,
        displayedStories,
        isLoading,
        loadMoreStories,
    } = useInfiniteStoriesLoading(stories, pagination, category);

    return (
        <div>
            {displayedStories.map((story) => (
                <Link key={story.id} href={`/${story.slug}`} passHref>
                    <a style={{ display: 'block', marginBottom: 20 }}>
                        <img src={story.thumbnail_url} alt="" />
                        <span>{story.title}</span>
                    </a>
                </Link>
            ))}

            {/* Infinite loading with a button */}
            {canLoadMore && (
                <button
                    type="button"
                    onClick={loadMoreStories}
                    disabled={isLoading}
                    style={{ display: 'block', marginBlock: '20px' }}
                >
                    {isLoading ? 'Please wait...' : 'Load more'}
                </button>
            )}

            {/* Classic query-parameter based pagination */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Pagination {...pagination} />
        </div>
    );
};

export default Stories;
