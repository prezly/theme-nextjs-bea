// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
    Sentry.init({
        dsn: SENTRY_DSN,
        // Adjust this value in production, or use tracesSampler for greater control
        tracesSampleRate: 0.02,
        // ...
        // Note: if you want to override the automatic release value, do not set a
        // `release` value here - use the environment variable `SENTRY_RELEASE`, so
        // that it will also get attached to your source maps

        // This particular error is coming from Microsoft Outlook SafeLink crawler.
        // It doesn't affect the user experience in any way, but produces a lot of unwanted Sentry events.
        // See https://forum.sentry.io/t/unhandledrejection-non-error-promise-rejection-captured-with-value/14062
        ignoreErrors: ['Object Not Found Matching Id'],
        // Attach theme tag to each event
        initialScope: (scope) => {
            scope.setTags({ prezly_theme: 'bea' });
            return scope;
        },
    });
}
