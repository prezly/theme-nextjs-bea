'use client';

import { MEDIA, useAnalytics } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { EmbedNode } from '@prezly/story-content-format';
import { useCallback, useRef } from 'react';

interface Props {
    node: EmbedNode;
}

export function Embed({ node }: Props) {
    const { track } = useAnalytics();
    const isEventTracked = useRef(false);

    const handlePlay = useCallback(() => {
        if (!isEventTracked.current) {
            track(MEDIA.PLAY);
            isEventTracked.current = true;
        }
    }, [track]);

    return <Elements.Embed node={node} onPlay={handlePlay} />;
}
