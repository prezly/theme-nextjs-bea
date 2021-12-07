import type { Newsroom } from '@prezly/sdk';

const ANALYTICS_URL = 'https://analytics-cdn.prezly.com/analytics.js/v1';
const ANALYTICS_VERSION = '4.1.0';

export function getAnalyticsJsUrl(uuid: Newsroom['uuid']): string {
    return `${ANALYTICS_URL}/${uuid}/prezly.min.js?version=${ANALYTICS_VERSION}`;
}
