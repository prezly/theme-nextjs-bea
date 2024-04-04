'use client';

import { Elements } from '@prezly/content-renderer-react-js';
import type { VideoNode } from '@prezly/story-content-format';
import { useCallback } from 'react';

interface Props {
    node: VideoNode;
}

export function Video({ node }: Props) {
    const handlePlay = useCallback(() => {
        console.log('media play!');
    }, []);

    const nodee: VideoNode = {
        ...node,
        oembed: { ...node.oembed, html: node.oembed.html?.replace('//', 'https://') },
    };

    return <Elements.Video node={nodee} onPlay={handlePlay} />;
}
