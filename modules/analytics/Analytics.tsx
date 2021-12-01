import { Newsroom, Story, TrackingPolicy } from '@prezly/sdk';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { FunctionComponent, useEffect } from 'react';

import { getAnalyticsJsUrl, page, stub } from './lib';

interface Props {
    newsroom: Newsroom;
    story: Story | undefined;
}

const Analytics: FunctionComponent<Props> = ({ newsroom, story }) => {
    const { uuid, tracking_policy: trackingPolicy } = newsroom;
    const { asPath } = useRouter();

    useEffect(() => {
        page();
    }, [asPath]);

    useEffect(() => {
        if (trackingPolicy === TrackingPolicy.DISABLED) {
            window.analytics = stub;
        }
    });

    return (
        <>
            <Head>
                <meta name="prezly:newsroom" content={newsroom.uuid} />
                {story && <meta name="prezly:story" content={story.uuid} />}
            </Head>
            {trackingPolicy !== TrackingPolicy.DISABLED && (
                <Script key="prezly-analytics" src={getAnalyticsJsUrl(uuid)} />
            )}
        </>
    );
};

export default Analytics;
