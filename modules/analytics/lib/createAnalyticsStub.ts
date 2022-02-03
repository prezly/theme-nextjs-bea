import type { AnalyticsJS } from '../types';

const methods = [
    'alias',
    'debug',
    'group',
    'identify',
    'load',
    'off',
    'on',
    'once',
    'page',
    'pageview',
    'ready',
    'reset',
    'track',
    'trackClick',
    'trackForm',
    'trackLink',
    'trackSubmit',
];

/**
 * A stub version of Prezly analytics.js snippet.
 * Needed to inject a noop `analytics` object into page,
 * to keep all the tracking calls working (and doing nothing).
 */
export function createAnalyticsStub() {
    return methods.reduce(
        (analytics, method) => ({
            ...analytics,
            [method]() {
                return this;
            },
        }),
        {},
    ) as AnalyticsJS;
}
