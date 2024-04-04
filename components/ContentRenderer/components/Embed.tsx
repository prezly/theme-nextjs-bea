'use client';

import { Elements } from '@prezly/content-renderer-react-js';
import type { EmbedNode } from '@prezly/story-content-format';
import { useCallback } from 'react';

interface Props {
    node: EmbedNode;
}

export function Embed({ node }: Props) {
    const handlePlay = useCallback(() => {
        console.log('media play!');
    }, []);

    return <Elements.Embed node={node} onPlay={handlePlay} />;
}
