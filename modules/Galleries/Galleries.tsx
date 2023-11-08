'use client';

import type { NewsroomGallery } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-intl';
import { type PaginationProps, useInfiniteGalleriesLoading } from '@prezly/theme-kit-nextjs';

import { PageTitle } from '@/components/PageTitle';
import { useIntl } from '@/theme-kit/intl/client';
import { Button } from '@/ui';

import { GalleriesList } from './GalleriesList';

import styles from './Galleries.module.scss';

type Props = {
    initialGalleries: NewsroomGallery[];
    pagination: PaginationProps;
};

export function Galleries({ initialGalleries, pagination }: Props) {
    const { formatMessage } = useIntl();

    const { canLoadMore, galleries, isLoading, loadMoreGalleries } = useInfiniteGalleriesLoading(
        initialGalleries,
        pagination,
    );

    return (
        <>
            <PageTitle title={formatMessage(translations.mediaGallery.title)} />
            <GalleriesList galleries={galleries} />

            {canLoadMore && (
                <Button
                    variation="secondary"
                    onClick={loadMoreGalleries}
                    loading={isLoading}
                    className={styles.loadMore}
                >
                    {formatMessage(
                        isLoading ? translations.misc.stateLoading : translations.actions.loadMore,
                    )}
                </Button>
            )}
        </>
    );
}
