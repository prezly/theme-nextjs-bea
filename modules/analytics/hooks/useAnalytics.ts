import { TrackingPolicy } from '@prezly/sdk';
import { useCallback, useEffect } from 'react';
import { useLocalStorage, useQueue } from 'react-use';

import { useAnalyticsContext } from '../context';
import { stringify } from '../lib';
import type { DeferredIdentity } from '../types';

const DEFERRED_IDENTITY_STORAGE_KEY = 'prezly_ajs_deferred_identity';

export function useAnalytics() {
    const { consent, isAnalyticsReady, isEnabled, newsroom, trackingPolicy } =
        useAnalyticsContext();
    const [deferredIdentity, setDeferredIdentity, removeDeferredIdentity] =
        useLocalStorage<DeferredIdentity>(DEFERRED_IDENTITY_STORAGE_KEY);
    const {
        add: addToQueue,
        remove: removeFromQueue,
        first: firstInQueue,
    } = useQueue<Function>([]);

    const buildOptions = useCallback(() => {
        if (consent) {
            // No extra options
            return {};
        }

        /**
         * Mask IP address
         * @see https://segment.com/docs/sources/website/analytics.js/#anonymizing-ip
         */
        return {
            context: {
                ip: '0.0.0.0',
            },
        };
    }, [consent]);

    const identify = useCallback(
        (userId: string, traits: object = {}, callback?: () => void) => {
            if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.log(`analytics.identify(${stringify(userId, traits)})`);
            }

            if (trackingPolicy === TrackingPolicy.CONSENT_TO_IDENTIFY && !consent) {
                setDeferredIdentity({ userId, traits });
                if (callback) {
                    callback();
                }

                return;
            }

            addToQueue(() => {
                if (window.analytics && window.analytics.identify) {
                    window.analytics.identify(userId, traits, buildOptions(), callback);
                }
            });
        },
        [addToQueue, buildOptions, consent, setDeferredIdentity, trackingPolicy],
    );

    function alias(userId: string, previousId: string) {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.log(`analytics.alias(${stringify(userId, previousId)})`);
        }

        addToQueue(() => {
            if (window.analytics && window.analytics.alias) {
                window.analytics.alias(userId, previousId, buildOptions());
            }
        });
    }

    function page(
        category?: string,
        name?: string,
        properties: object = {},
        callback?: () => void,
    ) {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.log(`analytics.page(${stringify(category, name, properties)})`);
        }

        addToQueue(() => {
            if (window.analytics && window.analytics.page) {
                window.analytics.page(category, name, properties, buildOptions(), callback);
            }
        });
    }

    function track(event: string, properties: object = {}, callback?: () => void) {
        if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.log(`analytics.track(${stringify(event, properties)})`);
        }

        addToQueue(() => {
            if (window.analytics && window.analytics.track) {
                window.analytics.track(event, properties, buildOptions(), callback);
            }
        });
    }

    function user() {
        if (window.analytics && window.analytics.user) {
            return window.analytics.user();
        }

        // Return fake user API to keep code working even without analytics.js loaded
        return {
            id() {
                return null;
            },
        };
    }

    useEffect(() => {
        // We are using simple queue to trigger tracking calls
        // that might have been created before analytics.js was loaded.
        if (isAnalyticsReady && firstInQueue) {
            firstInQueue();
            removeFromQueue();
        }
    }, [firstInQueue, isAnalyticsReady, removeFromQueue]);

    useEffect(() => {
        if (consent) {
            if (deferredIdentity) {
                const { userId, traits } = deferredIdentity;
                identify(userId, traits);
                removeDeferredIdentity();
            }
        } else {
            const id = user().id();
            if (id) {
                setDeferredIdentity({ userId: id });
            }

            user().id(null); // erase user ID
        }
    }, [consent, deferredIdentity, identify, removeDeferredIdentity, setDeferredIdentity]);

    if (!isEnabled) {
        return {
            alias: () => {},
            identify: () => {},
            page: () => {},
            track: () => {},
            user,
        };
    }

    return {
        alias,
        identify,
        newsroom,
        page,
        track,
        user,
    };
}
