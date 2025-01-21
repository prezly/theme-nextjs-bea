/* eslint-disable @next/next/no-img-element */

'use client';

import type { EmbedNode } from '@prezly/story-content-format';
import NextLink from 'next/link';

import styles from './EmbedFallback.module.scss';

interface Props {
    node: EmbedNode;
}

export function EmbedFallback({ node }: Props) {
    if (node.oembed.screenshot_url) {
        return (
            <NextLink className={styles.imageFallback} href={node.url} target="__blank">
                <img
                    src={node.oembed.screenshot_url}
                    alt={node.oembed.title || node.oembed.description || ''}
                />
            </NextLink>
        );
    }

    return null;
}
