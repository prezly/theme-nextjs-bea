import type { PrezlyMeta, TrackingPolicy } from '@prezly/analytics-nextjs';

export interface Config {
    trackingPolicy: TrackingPolicy;
    plausible: {
        isEnabled: boolean;
        siteId: string;
    };
    segment: {
        writeKey: string | null;
    };
    google: {
        analyticsId: string | null;
    };
    meta: PrezlyMeta;
}
