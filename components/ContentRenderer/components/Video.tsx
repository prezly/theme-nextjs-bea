'use client';

import { MEDIA } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { VideoNode } from '@prezly/story-content-format';
import { useCallback, useRef } from 'react';

import { analytics } from '@/utils';

interface Props {
    node: VideoNode;
}

export function Video({ node }: Props) {
    const isEventTracked = useRef(false);

    const handlePlay = useCallback(() => {
        if (!isEventTracked.current) {
            analytics.track(MEDIA.PLAY);
            isEventTracked.current = true;
        }
    }, []);

    return <Elements.Video node={node} onPlay={handlePlay} />;
}
