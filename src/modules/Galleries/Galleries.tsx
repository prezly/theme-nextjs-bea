'use client';

import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations, useInfiniteLoading } from '@prezly/theme-kit-nextjs';
import { useCallback } from 'react';

import { http, useIntl } from '@/adapters/client';
import { Button } from '@/components/Button';
import { PageTitle } from '@/components/PageTitle';
import { isPreviewActive } from '@/utils';

import { GalleriesList } from './GalleriesList';

import styles from './Galleries.module.scss';
import { PlaceholderGallery } from './PlaceholderGallery';

type Props = {
    localeCode: Locale.Code;
    pageSize: number;
    initialGalleries?: NewsroomGallery[];
    total?: number;
    newsroomUuid: string;
};

function fetchGalleries(offset: number, limit: number) {
    return http.get<{ data: NewsroomGallery[]; total: number }>('/api/galleries', {
        offset,
        limit,
    });
}

const PLACEHOLDER_TITLES = ['Media kit', 'Product shots', 'Latest event'];

export function Galleries({ initialGalleries, localeCode, pageSize, total, newsroomUuid }: Props) {
    const { formatMessage } = useIntl();
    const isPreview = isPreviewActive();

    const { load, loading, data, done } = useInfiniteLoading(
        useCallback((offset) => fetchGalleries(offset, pageSize), [pageSize]),
        { data: initialGalleries, total },
    );

    return (
        <>
            <PageTitle
                className={styles.title}
                subtitle={
                    isPreview && data.length === 0
                        ? 'Showcase brand assets like logos, headshots, and product pictures, easily downloadable to site visitors, and linkable from stories.'
                        : undefined
                }
                title={formatMessage(translations.mediaGallery.title)}
            />

            {isPreview && data.length === 0 && (
                <div className={styles.placeholderCards}>
                    {PLACEHOLDER_TITLES.map((title) => (
                        <PlaceholderGallery key={title} title={title} newsroomUuid={newsroomUuid} />
                    ))}
                </div>
            )}

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
