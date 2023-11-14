import 'server-only';
import type { Newsroom, NewsroomTheme, Story } from '@prezly/sdk';
import { createPrezlyClient } from '@prezly/sdk';

import { type Resolvable, resolve } from '@/theme-kit/resolvable';

import { createCachedFetch, createContentDeliveryClient } from './lib';

interface Configuration {
    accessToken: string;
    newsroom: Newsroom['uuid'];
    theme?: NewsroomTheme['id'];
    baseUrl?: string;
    headers?: Record<string, string>;
    pinning?: boolean;
    formats?: Story.FormatVersion[];
}

interface CacheConfiguration {
    ttl?: number;
}

const DEFAULT_REQUEST_CACHE_TTL = 10000;

export function integratePrezlyClient(
    config: Resolvable<Configuration>,
    cacheConfig: CacheConfiguration = {},
) {
    const fetch = createCachedFetch({
        ttl: cacheConfig.ttl ?? DEFAULT_REQUEST_CACHE_TTL,
    });

    function usePrezlyClient() {
        const {
            // sdk client properties
            accessToken,
            baseUrl,
            headers,
            // contentDelivery client properties
            newsroom,
            theme,
            pinning,
            formats,
        } = resolve(config);

        const client = createPrezlyClient({ fetch, accessToken, baseUrl, headers });
        const contentDelivery = createContentDeliveryClient(client, newsroom, theme, {
            pinning,
            formats,
        });

        return { client, contentDelivery };
    }

    return { usePrezlyClient };
}