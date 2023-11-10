import 'server-only';
import type { Newsroom, NewsroomTheme } from '@prezly/sdk';
import { createPrezlyClient } from '@prezly/sdk';

import { type Resolvable, resolvable } from '@/theme-kit/resolvable';

import { createCachedFetch, createContentDeliveryClient } from './lib';

interface Configuration {
    accessToken: string;
    newsroom: Newsroom['uuid'];
    theme?: NewsroomTheme['id'];
    baseUrl?: string;
    headers?: Record<string, string>;
}

export function integratePrezlyClient(config: Resolvable<Configuration>) {
    const resolveConfig = resolvable(config);

    const fetch = createCachedFetch({
        ttl: process.env.NODE_ENV === 'production' ? 10000 : Infinity,
    });

    function usePrezlyClient() {
        const { accessToken, newsroom, theme, baseUrl, headers } = resolveConfig();

        const client = createPrezlyClient({ fetch, accessToken, baseUrl, headers });
        const contentDelivery = createContentDeliveryClient(client, newsroom, theme);

        return { client, contentDelivery };
    }

    return { usePrezlyClient };
}
