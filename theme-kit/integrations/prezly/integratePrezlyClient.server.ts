import 'server-only';
import type { Newsroom, NewsroomTheme } from '@prezly/sdk';
import { createPrezlyClient } from '@prezly/sdk';

import { type Resolvable, resolve } from '@/theme-kit/resolvable';

import { createCachedFetch, createContentDeliveryClient } from './lib';

interface Configuration {
    accessToken: string;
    newsroom: Newsroom['uuid'];
    theme?: NewsroomTheme['id'];
    baseUrl?: string;
    headers?: Record<string, string>;
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
        const { accessToken, newsroom, theme, baseUrl, headers } = resolve(config);

        const client = createPrezlyClient({ fetch, accessToken, baseUrl, headers });
        const contentDelivery = createContentDeliveryClient(client, newsroom, theme);

        return { client, contentDelivery };
    }

    return { usePrezlyClient };
}
