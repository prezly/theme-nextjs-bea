'use client';

import { Tracking } from '@prezly/analytics-nextjs';
import { useDebouncedCallback } from '@react-hookz/web';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { analytics } from '@/utils';

import { useBroadcastedGallery, useBroadcastedStory } from '../Broadcast';

import type { Config } from './types';
import { useAnalytics } from './useAnalytics';

export function Analytics(props: Config) {
    const pathname = usePathname();
    const story = useBroadcastedStory();
    const gallery = useBroadcastedGallery();
    const debouncedPage = useDebouncedCallback(() => analytics.page(), [], 100);

    // biome-ignore lint/correctness/useExhaustiveDependencies: Pathname is required here to trigger this effect on navigation
    useEffect(() => {
        console.log('analytics effect');
        debouncedPage();
    }, [pathname, debouncedPage]);

    useAnalytics({
        ...props,
        meta: {
            ...props.meta,
            story: story?.uuid,
            gallery: gallery?.uuid,
        },
    });

    return <Tracking analytics={analytics} />;
}
