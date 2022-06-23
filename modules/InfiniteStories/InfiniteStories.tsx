import type { Category } from '@prezly/sdk';
import { type PaginationProps, useInfiniteStoriesLoading } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { Button } from '@prezly/themes-ui-components';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import type { StoryWithImage } from 'types';

import StoriesList from './StoriesList';

import styles from './InfiniteStories.module.scss';

type Props = {
    initialStories: StoryWithImage[];
    pagination: PaginationProps;
    category?: Category;
};

function InfiniteStories({ initialStories, pagination, category }: Props) {
    const { formatMessage } = useIntl();

    const { canLoadMore, isLoading, loadMoreStories, stories } = useInfiniteStoriesLoading(
        initialStories,
        pagination,
        category,
        ['thumbnail_image'],
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
}

export default InfiniteStories;
