'use client';

import { MEDIA } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import { Newsroom } from '@prezly/sdk';
import type { VideoNode } from '@prezly/story-content-format';
import { useCallback, useRef } from 'react';

import { ConsentCategory, useCookieConsent } from '@/modules/CookieConsent';
import { analytics } from '@/utils';

import { NoConsentFallback } from './NoConsentFallback';

interface Props {
    node: VideoNode;
}

export function Video({ node }: Props) {
    const isEventTracked = useRef(false);
    const { consent, trackingPolicy } = useCookieConsent();
    const canUseThirdPartyCookie =
        trackingPolicy === Newsroom.TrackingPolicy.LENIENT ||
        Boolean(consent?.categories.includes(ConsentCategory.THIRD_PARTY_COOKIES));

    const handlePlay = useCallback(() => {
        if (!isEventTracked.current) {
            analytics.track(MEDIA.PLAY);
            isEventTracked.current = true;
        }
    }, []);

    if (!canUseThirdPartyCookie) {
        return <NoConsentFallback id={`video-${node.uuid}`} entity="video" oembed={node.oembed} />;
    }

    return <Elements.Video node={node} onPlay={handlePlay} />;
}
