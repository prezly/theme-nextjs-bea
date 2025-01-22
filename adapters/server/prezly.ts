import { Story } from '@prezly/sdk';
import { PrezlyAdapter } from '@prezly/theme-kit-nextjs/server';
import { headers, type UnsafeUnwrappedHeaders } from 'next/headers';

import { environment } from './environment';

// @ts-ignore
const IS_EDGE_RUNTIME = typeof EdgeRuntime === 'string';

interface Config {
    cache?: boolean;
}

/**
 * @internal Using this adapter directly is rarely needed. You should be good using `app()` in most of the cases.
 */
export function initPrezlyClient(
    requestHeaders: Headers = headers() as unknown as UnsafeUnwrappedHeaders,
    { cache = true }: Config = {},
) {
    const adapter = PrezlyAdapter.connect(
        () => {
            const env = environment(requestHeaders);

            return {
                accessToken: env.PREZLY_ACCESS_TOKEN,
                baseUrl: env.PREZLY_API_BASEURL,
                newsroom: env.PREZLY_NEWSROOM_UUID,
                theme: env.PREZLY_THEME_UUID,
                pinning: true,
                formats: [Story.FormatVersion.SLATEJS_V6],
            };
        },
        {
            cache: cache
                ? {
                      memory: true,
                      redis:
                          !IS_EDGE_RUNTIME && process.env.REDIS_CACHE_URL
                              ? { url: process.env.REDIS_CACHE_URL }
                              : undefined,
                      latestVersion: () =>
                          parseInt(requestHeaders.get('X-Newsroom-Cache-Version') ?? '0'),
                  }
                : undefined,
        },
    );

    return adapter.usePrezlyClient();
}
