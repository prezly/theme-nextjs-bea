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
};

const InfiniteStories: FunctionComponent<Props> = ({ initialStories, pagination, category }) => {
    const { formatMessage } = useIntl();

    const { canLoadMore, isLoading, loadMoreStories, stories } = useInfiniteStoriesLoading(
        initialStories,
        pagination,
        category,
    );

    return (
        <div
            className={classNames(styles.container, {
                [styles.categoryContainer]: Boolean(category),
            })}
        >
            <StoriesList stories={stories} isCategoryList={Boolean(category)} />

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
