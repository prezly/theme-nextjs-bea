import { AnalyticsContextProvider } from '@prezly/analytics-nextjs';
import type { ReactNode } from 'react';

import { analytics, app } from '@/adapters/server';

interface Props {
    children: ReactNode;
}

export async function AnalyticsProvider({ children }: Props) {
    const newsroom = await app().newsroom();
    const { isTrackingEnabled } = analytics();

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
            isEnabled={isTrackingEnabled}
        >
            {children}
        </AnalyticsContextProvider>
    );
}
