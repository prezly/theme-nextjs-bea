'use client';

import { AnalyticsContextProvider, useAnalytics } from '@prezly/analytics-nextjs';
import type { Newsroom, Story } from '@prezly/sdk';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

import { useDebounce } from 'hooks';

import { useBroadcastedStory } from '../Broadcast';

interface Props {
    children: ReactNode;
    isEnabled: boolean;
    newsroom: Newsroom;
    story?: Story;
}

export function AnalyticsProvider({ children, isEnabled, newsroom }: Props) {
    const story = useBroadcastedStory();

    return (
        <AnalyticsContextProvider
            // We want to minimize the payload passed between server and client components.
            // That's why it's important to only take fields that are necessary.
            newsroom={{
                uuid: newsroom.uuid,
                segment_analytics_id: newsroom.segment_analytics_id,
                is_plausible_enabled: newsroom.is_plausible_enabled,
                plausible_site_id: newsroom.plausible_site_id,
                tracking_policy: newsroom.tracking_policy,
                ga_tracking_id: newsroom.google_analytics_id,
            }}
            story={story ? { uuid: story.uuid } : undefined}
            isEnabled={isEnabled}
        >
            <OnPageView />
            {children}
        </AnalyticsContextProvider>
    );
}

function OnPageView() {
    const { page } = useAnalytics();
    const currentPath = usePathname();
    const debouncedPage = useDebounce(0, page);

    useEffect(() => {
        debouncedPage();
    }, [currentPath, debouncedPage]);

    return null;
}
