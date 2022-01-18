import type { Category } from '@prezly/sdk';
import translations from '@prezly/themes-intl-messages';
import classNames from 'classnames';
import type { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import { Button } from '@/components';
import { PaginationProps, StoryWithImage } from 'types';

import { useInfiniteStoriesLoading } from './lib';
import StoriesList from './StoriesList';

import styles from './InfiniteStories.module.scss';

type Props = {
    initialStories: StoryWithImage[];
    pagination: PaginationProps;
    category?: Category;
    isSearchResults?: boolean;
};

const InfiniteStories: FunctionComponent<Props> = ({
    initialStories,
    pagination,
    category,
    isSearchResults,
}) => {
    const { formatMessage } = useIntl();

    // TODO: Add custom stories loader for the search page
    const { canLoadMore, isLoading, loadMoreStories, stories } = useInfiniteStoriesLoading(
        initialStories,
        pagination,
        category,
    );

    return (
        <div
            className={classNames(styles.container, {
                [styles.categoryContainer]: Boolean(category),
                [styles.searchResultsContainer]: isSearchResults,
            })}
        >
            <StoriesList
                stories={stories}
                isCategoryList={Boolean(category)}
                isSearchResults={isSearchResults}
            />

            {canLoadMore && (
                <Button
                    variation="secondary"
                    onClick={loadMoreStories}
                    isLoading={isLoading}
                    className={styles.loadMore}
                >
                    {formatMessage(
                        isLoading ? translations.misc.stateLoading : translations.actions.loadMore,
                    )}
                </Button>
            )}
        </div>
    );
};

export default InfiniteStories;
