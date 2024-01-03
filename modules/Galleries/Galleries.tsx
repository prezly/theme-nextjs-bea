'use client';

import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations, useInfiniteLoading } from '@prezly/theme-kit-nextjs';
import { useCallback } from 'react';

import { http, useIntl } from '@/adapters/client';
import { Button } from '@/components/Button';
import { PageTitle } from '@/components/PageTitle';

import { GalleriesList } from './GalleriesList';

import styles from './Galleries.module.scss';

type Props = {
    localeCode: Locale.Code;
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

export function Galleries({ initialGalleries, localeCode, pageSize, total }: Props) {
    const { formatMessage } = useIntl();

    const { load, loading, data, done } = useInfiniteLoading(
        useCallback((offset) => fetchGalleries(offset, pageSize), [pageSize]),
        { data: initialGalleries, total },
    );

    return (
        <>
            <PageTitle title={formatMessage(translations.mediaGallery.title)} />
            <GalleriesList galleries={data} localeCode={localeCode} />

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
