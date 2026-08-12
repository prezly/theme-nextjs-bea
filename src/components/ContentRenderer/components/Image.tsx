'use client';

import { DOWNLOAD, VIEW } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { ImageNode } from '@prezly/story-content-format';
import type { PropsWithChildren } from 'react';

import { analytics } from '@/utils';
import { CDN_URL } from '@/constants';

import styles from '../ContentRenderer.module.scss';

interface Props {
    node: ImageNode;
}

function isWrappedImageNode(node: ImageNode): boolean {
    return 'wrap' in node && node.wrap === true;
}

export function Image({ node, children }: PropsWithChildren<Props>) {
    return (
        <Elements.Image
            className={isWrappedImageNode(node) ? styles.wrappedImage : undefined}
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
