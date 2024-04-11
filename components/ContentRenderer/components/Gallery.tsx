'use client';

import { DOWNLOAD, useAnalytics, VIEW } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { GalleryNode } from '@prezly/story-content-format';

interface Props {
    node: GalleryNode;
}

export function Gallery({ node }: Props) {
    const { track } = useAnalytics();

    return (
        <Elements.Gallery
            node={node}
            onImageDownload={(image) => {
                track(DOWNLOAD.GALLERY_IMAGE, { id: image.uuid });
            }}
            onPreviewOpen={(image) => {
                track(VIEW.GALLERY_IMAGE, { id: image.uuid });
            }}
        />
    );
}
