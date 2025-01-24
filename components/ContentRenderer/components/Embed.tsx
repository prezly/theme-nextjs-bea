/* eslint-disable @next/next/no-img-element */

'use client';

import { MEDIA, useAnalytics } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { EmbedNode } from '@prezly/story-content-format';
import { useCallback, useRef } from 'react';

import { ConsentCategory, useCookieConsent } from '@/modules/CookieConsent';

import { EmbedFallback } from './EmbedFallback';

interface Props {
    node: EmbedNode;
}

export function Embed({ node }: Props) {
    const { track } = useAnalytics();
    const isEventTracked = useRef(false);
    const { consent } = useCookieConsent();
    const hasThirdPartyConsent = consent?.categories.includes(ConsentCategory.THIRD_PARTY_COOKIES);

    const handlePlay = useCallback(() => {
        if (!isEventTracked.current) {
            track(MEDIA.PLAY);
            isEventTracked.current = true;
        }
    }, [track]);

    if (!hasThirdPartyConsent) {
        return <EmbedFallback node={node} />;
    }

    return <Elements.Embed node={node} onPlay={handlePlay} />;
}
