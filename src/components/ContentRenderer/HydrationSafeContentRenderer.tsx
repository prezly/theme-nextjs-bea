'use client';

import type { ExtendedStory } from '@prezly/sdk';
import type { Node } from '@prezly/story-content-format';
import { useEffect, useState } from 'react';

import { ContentRenderer } from './ContentRenderer';

interface Props {
    nodes: Node[];
    story?: ExtendedStory;
}

export function HydrationSafeContentRenderer({ nodes, story }: Props) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Render a placeholder during SSR to prevent hydration mismatches
    if (!isHydrated) {
        return (
            <div className="animate-pulse">
                <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                </div>
            </div>
        );
    }

    // Suppress hydration warnings for this specific component tree
    return (
        <div suppressHydrationWarning>
            <ContentRenderer nodes={nodes} story={story} />
        </div>
    );
}
