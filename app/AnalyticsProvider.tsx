/* eslint-disable react/jsx-props-no-spreading */

import { AnalyticsContextProvider } from '@prezly/analytics-nextjs';
import type { Newsroom } from '@prezly/sdk';
import type { ReactNode } from 'react';

interface Props {
    newsroom: Newsroom;
    isEnabled: boolean;
    children: ReactNode;
}

export function AnalyticsProvider({ newsroom, isEnabled, children }: Props) {
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
                ga_tracking_id: newsroom.ga_tracking_id,
            }}
            isEnabled={isEnabled}
        >
            {children}
        </AnalyticsContextProvider>
    );
}
