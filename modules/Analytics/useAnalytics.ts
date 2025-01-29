import { useEffect } from 'react';

import { analytics } from '@/utils';

import { useCookieConsent } from '../CookieConsent';

import type { Config } from './types';
import { useUpdateEffect } from '@react-hookz/web';

export function useAnalytics({ meta, google, plausible, segment, trackingPolicy }: Config) {
    const { consent } = useCookieConsent();

    useEffect(() => {
        analytics.init({
            meta,
            consent: consent || undefined,
            segment: {
                settings: {
                    writeKey: segment.writeKey || '',
                },
            },
            plausible: plausible.isEnabled
                ? { domain: [plausible.siteId, 'rollup.customers.prezly.com'].join(',') }
                : false,
            google: google.analyticsId ? { analyticsId: google.analyticsId } : undefined,
            trackingPolicy,
        });
    }, []);

    useUpdateEffect(() => {
        analytics.setMeta(meta);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta.gallery, meta.newsroom, meta.story, meta.tracking_policy]);

    useUpdateEffect(() => {
        if (consent) {
            analytics.setConsent(consent);
        }
    }, [consent]);
}
