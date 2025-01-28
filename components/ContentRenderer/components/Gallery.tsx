'use client';

import { DOWNLOAD, VIEW } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { GalleryNode } from '@prezly/story-content-format';

import { analytics } from '@/utils';

interface Props {
    node: GalleryNode;
}

export function Gallery({ node }: Props) {
    return (
        <Elements.Gallery
            node={node}
            onImageDownload={(image) => {
                analytics.track(DOWNLOAD.GALLERY_IMAGE, { id: image.uuid });
            }}
            onPreviewOpen={(image) => {
                analytics.track(VIEW.GALLERY_IMAGE, { id: image.uuid });
            }}
        />
    );
}
