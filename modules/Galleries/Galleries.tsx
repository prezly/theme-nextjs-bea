import { NewsroomGallery } from '@prezly/sdk';
import type { FunctionComponent } from 'react';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Button, PageTitle } from '@/components';
import { PaginationProps } from 'types';

import Layout from '../Layout';

import GalleriesList from './GalleriesList';
import { useInfiniteGalleriesLoading } from './lib';

import styles from './Galleries.module.scss';

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

const Galleries: FunctionComponent<Props> = ({ initialGalleries, pagination }) => {
    const { formatMessage } = useIntl();

    const { canLoadMore, galleries, isLoading, loadMoreGalleries } = useInfiniteGalleriesLoading(
        initialGalleries,
        pagination,
    );

    return (
        <Layout title={formatMessage(messages.title)} url="/gallery">
            <PageTitle title={formatMessage(messages.title)} />
            <GalleriesList galleries={galleries} />

            {canLoadMore && (
                <Button
                    variation="secondary"
                    onClick={loadMoreGalleries}
                    isLoading={isLoading}
                    className={styles.loadMore}
                >
                    {formatMessage(isLoading ? messages.loading : messages.actionLoadMore)}
                </Button>
            )}
        </Layout>
    );
};

export default Galleries;
