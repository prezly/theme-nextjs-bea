'use client';

import { DOWNLOAD, VIEW } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import { GalleryNode } from '@prezly/story-content-format';
import classNames from 'classnames';
import { memo, useMemo, useState } from 'react';

import { Button } from '@/components/Button';
import { analytics } from '@/utils';
import { CDN_URL } from '@/constants';

import styles from './Gallery.module.scss';

const BATCH_SIZE = 48;

const IMAGE_PADDING: Record<`${GalleryNode.Padding}`, number> = {
    [GalleryNode.Padding.SMALL]: 0,
    [GalleryNode.Padding.MEDIUM]: 2,
    [GalleryNode.Padding.LARGE]: 8,
};

interface Props {
    node: GalleryNode;
}

export function Gallery({ node }: Props) {
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
    const totalImages = node.images.length;
    const hasMore = visibleCount < totalImages;

    const chunkCount = Math.ceil(Math.min(visibleCount, totalImages) / BATCH_SIZE);
    const padding = IMAGE_PADDING[node.padding];

    return (
        <>
            <div className={styles.chunks} style={{ gap: padding * 2 }}>
                {Array.from({ length: chunkCount }, (_, index) => (
                    <GalleryChunk
                        key={index}
                        node={node}
                        startIndex={index * BATCH_SIZE}
                        endIndex={Math.min((index + 1) * BATCH_SIZE, totalImages)}
                        lazy={index > 0}
                    />
                ))}
            </div>
            {hasMore && (
                <div className={styles.loadMore}>
                    <p className={styles.count}>
                        Showing {Math.min(visibleCount, totalImages)} of {totalImages}
                    </p>
                    <Button
                        variation="secondary"
                        onClick={() => setVisibleCount((c) => c + BATCH_SIZE)}
                    >
                        Show more
                    </Button>
                </div>
            )}
        </>
    );
}

interface ChunkProps {
    node: GalleryNode;
    startIndex: number;
    endIndex: number;
    lazy: boolean;
}

const GalleryChunk = memo(function GalleryChunk({ node, startIndex, endIndex, lazy }: ChunkProps) {
    const chunkNode = useMemo(
        () => ({ ...node, images: node.images.slice(startIndex, endIndex) }),
        [node, startIndex, endIndex],
    );

    return (
        <div className={classNames(styles.chunk, { [styles.lazyChunk]: lazy })}>
            <Elements.Gallery
                node={chunkNode}
                onImageDownload={(image) => {
                    analytics.track(DOWNLOAD.GALLERY_IMAGE, { id: image.uuid });
                }}
                onPreviewOpen={(image) => {
                    analytics.track(VIEW.GALLERY_IMAGE, { id: image.uuid });
                }}
                baseCdnUrl={CDN_URL}
            />
        </div>
    );
});
