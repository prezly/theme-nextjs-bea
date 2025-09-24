import { useUpdateEffect } from '@react-hookz/web';
import { useEffect } from 'react';

import { analytics } from '@/utils';

import { useCookieConsent } from '../CookieConsent';

import type { Config } from './types';

export function useAnalytics({ meta, google, plausible, segment, trackingPolicy }: Config) {
    const { consent } = useCookieConsent();

    // biome-ignore lint/correctness/useExhaustiveDependencies: This effect should only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        analytics.init({
            meta,
            consent,
            segment: {
                settings: {
                    writeKey: segment.writeKey || '',
                },
            },
            plausible: plausible.isEnabled
                ? { domain: [plausible.siteId, 'rollup.customers.prezly.com'].join(',') }
                : false,
            google: google.analyticsId ? { analyticsId: google.analyticsId } : false,
            trackingPolicy,
        });
    }, []);

    useUpdateEffect(() => {
        analytics.setMeta(meta);
    }, [meta.gallery, meta.newsroom, meta.story, meta.tracking_policy]);

    useUpdateEffect(() => {
        if (consent) {
            analytics.setConsent(consent);
        }
    }, [consent]);
}
