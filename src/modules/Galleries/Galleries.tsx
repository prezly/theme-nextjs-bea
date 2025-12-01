'use client';

import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations, useInfiniteLoading } from '@prezly/theme-kit-nextjs';
import { useCallback, useEffect } from 'react';

import { http, useIntl, useRouting } from '@/adapters/client';
import { Button } from '@/components/Button';
import { PageTitle } from '@/components/PageTitle';
import { PREVIEW } from '@/events';
import { IconExternalLink } from '@/icons';
import { analytics, isPreviewActive } from '@/utils';

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
    const { generateUrl } = useRouting();
    const isPreview = isPreviewActive();
    const createGalleryUrl = `https://rock.prezly.com/sites/${newsroomUuid}/settings/galleries?overlay=site.${newsroomUuid}.gallery-create.image`;

    const { load, loading, data, done } = useInfiniteLoading(
        useCallback((offset) => fetchGalleries(offset, pageSize), [pageSize]),
        { data: initialGalleries, total },
    );

    useEffect(() => {
        if (!isPreview && data.length === 0) {
            window.location.replace(generateUrl('index', { localeCode }));
        }
    }, [data, isPreview, localeCode, generateUrl]);

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
                <a
                    className={styles.placeholderCards}
                    href={createGalleryUrl}
                    onClick={() => analytics.track(PREVIEW.CREATE_MEDIA_GALLERY_CLICKED)}
                    rel="noopener"
                    target="_blank"
                >
                    {PLACEHOLDER_TITLES.map((title) => (
                        <PlaceholderGallery key={title} title={title} />
                    ))}
                    <p className={styles.createGalleryText}>
                        Create gallery <IconExternalLink className={styles.icon} />
                    </p>
                </a>
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
