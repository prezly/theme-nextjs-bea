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

    return <Elements.Video node={node} onPlay={handlePlay} />;
}
