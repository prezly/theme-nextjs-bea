'use client';

import { DOWNLOAD, VIEW } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { ImageNode } from '@prezly/story-content-format';
import type { PropsWithChildren } from 'react';

import { analytics } from '@/utils';
import { CDN_URL } from '@/constants';

interface Props {
    node: ImageNode;
}

export function Image({ node, children }: PropsWithChildren<Props>) {
    return (
        <Elements.Image
            node={node}
            onDownload={(image) => {
                analytics.track(DOWNLOAD.IMAGE, { id: image.uuid });
            }}
            onPreviewOpen={(image) => {
                analytics.track(VIEW.IMAGE, { id: image.uuid });
            }}
            baseCdnUrl={CDN_URL}
        >
            {children}
        </Elements.Image>
    );
}
