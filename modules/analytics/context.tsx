import { Newsroom, Story, TrackingPolicy } from '@prezly/sdk';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { createContext, FunctionComponent, useEffect, useState } from 'react';

import { createAnalyticsStub, getAnalyticsJsUrl } from './lib';

interface Context {
    isAnalyticsReady: boolean;
    isConsentGranted: boolean;
    trackingPolicy: TrackingPolicy;
}

interface Props {
    newsroom: Newsroom;
    story: Story | undefined;
}

export const AnalyticsContext = createContext<Context>({
    isAnalyticsReady: false,
    isConsentGranted: false,
    trackingPolicy: TrackingPolicy.DEFAULT,
});

export const AnalyticsContextProvider: FunctionComponent<Props> = ({
    children,
    newsroom,
    story,
}) => {
    const { uuid, tracking_policy: trackingPolicy } = newsroom;
    const [isAnalyticsReady, setAnalyticsReady] = useState(false);
    const { asPath } = useRouter();

    useEffect(() => {
        if (isAnalyticsReady) {
            window.analytics.page(); // TODO: Figure out how to call `page` from `useAnalytics`
        }
    }, [asPath, isAnalyticsReady]);

    useEffect(() => {
        if (trackingPolicy === TrackingPolicy.DISABLED) {
            window.analytics = createAnalyticsStub();
        }
    });

    return (
        <AnalyticsContext.Provider
            value={{
                isAnalyticsReady,
                isConsentGranted: true,
                trackingPolicy: newsroom.tracking_policy,
            }}
        >
            <Head>
                <meta name="prezly:newsroom" content={newsroom.uuid} />
                {story && <meta name="prezly:story" content={story.uuid} />}
            </Head>
            {trackingPolicy !== TrackingPolicy.DISABLED && (
                <Script
                    key="prezly-analytics"
                    onLoad={() => setAnalyticsReady(true)}
                    src={getAnalyticsJsUrl(uuid)}
                />
            )}
            {children}
        </AnalyticsContext.Provider>
    );
};
