'use client';

import type { NewsroomGallery } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-intl';
import { useCallback } from 'react';

import { Button } from '@/components/Button';
import { PageTitle } from '@/components/PageTitle';
import { useIntl } from '@/theme/client';
import { useInfiniteLoading } from '@/theme-kit/hooks';
import { http } from '@/theme-kit/http';

import { GalleriesList } from './GalleriesList';

import styles from './Galleries.module.scss';

type Props = {
    pageSize: number;
    initialGalleries?: NewsroomGallery[];
    total?: number;
};

function fetchGalleries(offset: number, limit: number) {
    return http.get<{ data: NewsroomGallery[]; total: number }>(`/api/galleries`, {
        offset,
        limit,
    });
}

export function Galleries({ initialGalleries, pageSize, total }: Props) {
    const { formatMessage } = useIntl();

    const { load, loading, data, done } = useInfiniteLoading(
        useCallback(async (offset) => fetchGalleries(offset, pageSize), [pageSize]),
        { data: initialGalleries, total },
    );

    return (
        <>
            <PageTitle title={formatMessage(translations.mediaGallery.title)} />
            <GalleriesList galleries={data} />

            {!done && (
                <Button
                    variation="secondary"
                    onClick={load}
                    loading={loading}
                    className={styles.loadMore}
                >
                    {formatMessage(
                        loading ? translations.misc.stateLoading : translations.actions.loadMore,
                    )}
                </Button>
            )}
        </>
    );
}
