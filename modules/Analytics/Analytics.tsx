'use client';

import { Tracking } from '@prezly/analytics-nextjs';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useDebounce } from 'hooks/useDebounce';
import { analytics } from 'utils/analytics';

import { useBroadcastedGallery, useBroadcastedStory } from '../Broadcast';

import type { Config } from './types';
import { useAnalytics } from './useAnalytics';

export function Analytics(props: Config) {
    const pathname = usePathname();
    const story = useBroadcastedStory();
    const gallery = useBroadcastedGallery();
    const debouncedPage = useDebounce(100, () => analytics.page());

    useEffect(() => {
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
