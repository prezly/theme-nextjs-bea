'use client';

import { DOWNLOAD, VIEW } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { ImageNode } from '@prezly/story-content-format';
import type { CSSProperties, PropsWithChildren } from 'react';

import { analytics } from '@/utils';
import { CDN_URL } from '@/constants';

import styles from '../ContentRenderer.module.scss';

interface Props {
    node: ImageNode;
}

function isWrappedImageNode(node: ImageNode): boolean {
    return 'wrap' in node && node.wrap === true;
}

function getWrappedImageStyle(node: ImageNode): CSSProperties | undefined {
    if (!isWrappedImageNode(node)) {
        return undefined;
    }

    return {
        ...(node.width ? { width: node.width } : {}),
        maxWidth: `min(50%, ${node.file.original_width}px)`,
    };
}

export function Image({ node, children }: PropsWithChildren<Props>) {
    const isWrapped = isWrappedImageNode(node);

    return (
        <Elements.Image
            className={isWrapped ? styles.wrappedImage : undefined}
            node={node}
            style={getWrappedImageStyle(node)}
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
