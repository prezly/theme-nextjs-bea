'use client';

import { MEDIA, useAnalytics } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { VideoNode } from '@prezly/story-content-format';
import { useCallback, useRef } from 'react';

interface Props {
    node: VideoNode;
}

export function Video({ node }: Props) {
    const { track } = useAnalytics();
    const isEventTracked = useRef(false);

    const handlePlay = useCallback(() => {
        if (!isEventTracked.current) {
            track(MEDIA.PLAY);
            isEventTracked.current = true;
        }
    }, [track]);

    return <Elements.Video node={node} onPlay={handlePlay} />;
}
