import { Newsroom, Story } from '@prezly/sdk';
import Head from 'next/head';
import Script from 'next/script';
import React, { FunctionComponent } from 'react';

import { getAnalyticsJsUrl } from './lib';

interface Props {
    newsroom: Newsroom;
    story: Story | undefined;
}

const Analytics: FunctionComponent<Props> = ({ newsroom, story }) => {
    const { uuid } = newsroom;

    return (
        <>
            <Head>
                <meta name="prezly:newsroom" content={newsroom.uuid} />
                {story && <meta name="prezly:story" content={story.uuid} />}
            </Head>
            <Script key="prezly-analytics" src={getAnalyticsJsUrl(uuid)} />
        </>
    );
};

export default Analytics;
