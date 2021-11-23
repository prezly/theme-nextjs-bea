import { NewsroomGallery } from '@prezly/sdk';
import { actionLoadMore, loading, mediaGalleryTitle } from '@prezly/themes-intl-messages';
import type { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

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

const Galleries: FunctionComponent<Props> = ({ initialGalleries, pagination }) => {
    const { formatMessage } = useIntl();

    const { canLoadMore, galleries, isLoading, loadMoreGalleries } = useInfiniteGalleriesLoading(
        initialGalleries,
        pagination,
    );

    return (
        <Layout title={formatMessage(mediaGalleryTitle)}>
            <PageTitle title={formatMessage(mediaGalleryTitle)} />
            <GalleriesList galleries={galleries} />

            {canLoadMore && (
                <Button
                    variation="secondary"
                    onClick={loadMoreGalleries}
                    isLoading={isLoading}
                    className={styles.loadMore}
                >
                    {formatMessage(isLoading ? loading : actionLoadMore)}
                </Button>
            )}
        </Layout>
    );
};

export default Galleries;
