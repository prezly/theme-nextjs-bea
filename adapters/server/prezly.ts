// @ts-ignore
import { Story } from '@prezly/sdk';
import { PrezlyAdapter } from '@prezly/theme-kit-nextjs/server';
import { headers } from 'next/headers';

import { environment } from './environment';

const { usePrezlyClient } = PrezlyAdapter.connect(
    () => {
        const env = environment();

        return {
            accessToken: env.PREZLY_ACCESS_TOKEN,
            baseUrl: env.PREZLY_API_BASEURL,
            newsroom: env.PREZLY_NEWSROOM_UUID,
            theme: env.PREZLY_THEME_UUID,
            pinning: true,
            formats: [Story.FormatVersion.SLATEJS_V5],
        };
    },
    {
        cache: {
            memory: true,
            redis: process.env.REDIS_CACHE_URL ? { url: process.env.REDIS_CACHE_URL } : undefined,
            latestVersion: () => parseInt(headers().get('X-Newsroom-Cache-Version') ?? '0'),
        },
    },
);

/**
 * @internal Using this adapter directly is rarely needed. You should be good using `app()` in most of the cases.
 */
export const initPrezlyClient = usePrezlyClient;
