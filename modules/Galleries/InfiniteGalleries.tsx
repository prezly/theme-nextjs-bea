import { NewsroomGallery } from '@prezly/sdk';
import type { FunctionComponent } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { PageTitle } from '@/components';
import { PaginationProps } from 'types';

import GalleriesList from './GalleriesList';

type Props = {
    initialGalleries: NewsroomGallery[];
    pagination: PaginationProps;
};

const messages = defineMessages({
    title: {
        defaultMessage: 'Media Gallery',
    },
    loading: {
        defaultMessage: 'Loading...',
    },
    actionLoadMore: {
        defaultMessage: 'Load more',
    },
});

const InfiniteGalleries: FunctionComponent<Props> = ({ initialGalleries, pagination }) => {
    const { formatMessage } = useIntl();

    return (
        <div>
            <PageTitle title={formatMessage(messages.title)} />
            <GalleriesList galleries={initialGalleries} />

            {/* {canLoadMore && (
                <Button
                    variation="secondary"
                    onClick={loadMoreStories}
                    isLoading={isLoading}
                    className={styles.loadMore}
                >
                    {formatMessage(isLoading ? messages.loading : messages.actionLoadMore)}
                </Button>
            )} */}
        </div>
    );
};
export default InfiniteGalleries;
