import { Newsroom, Story, TrackingPolicy } from '@prezly/sdk';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { createAnalyticsStub, getAnalyticsJsUrl, page } from './lib';

interface Props {
    newsroom: Newsroom;
    story: Story | undefined;
}

const Analytics: FunctionComponent<Props> = ({ newsroom, story }) => {
    const { uuid, tracking_policy: trackingPolicy } = newsroom;
    const [isLoaded, setLoaded] = useState(false);
    const { asPath } = useRouter();

    useEffect(() => {
        if (isLoaded) {
            page();
        }
    }, [asPath, isLoaded]);

    useEffect(() => {
        if (trackingPolicy === TrackingPolicy.DISABLED) {
            window.analytics = createAnalyticsStub();
        }
    });

    return (
        <>
            <Head>
                <meta name="prezly:newsroom" content={newsroom.uuid} />
                {story && <meta name="prezly:story" content={story.uuid} />}
            </Head>
            {trackingPolicy !== TrackingPolicy.DISABLED && (
                <Script
                    key="prezly-analytics"
                    onLoad={() => setLoaded(true)}
                    src={getAnalyticsJsUrl(uuid)}
                />
            )}
        </>
    );
};

export default Analytics;
