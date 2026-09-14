import { Story } from '@prezly/sdk';
import { ContentDelivery } from '@prezly/theme-kit-nextjs';
import { PrezlyAdapter } from '@prezly/theme-kit-nextjs/server';
import { headers, type UnsafeUnwrappedHeaders } from 'next/headers';

import { environment } from './environment';

// @ts-expect-error
const IS_EDGE_RUNTIME = typeof EdgeRuntime === 'string';

interface Config {
    cache?: boolean;
    fetch?: typeof globalThis.fetch;
    requestScope?: string;
}

/**
 * @internal Using this adapter directly is rarely needed. You should be good using `app()` in most of the cases.
 */
export function initPrezlyClient(
    requestHeaders: Headers = headers() as unknown as UnsafeUnwrappedHeaders,
    { cache = true, fetch, requestScope }: Config = {},
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
            fetch,
            // Edge middleware has its own realm and is not scraped by the Node exporter.
            telemetry:
                !IS_EDGE_RUNTIME && process.env.BEA_METRICS_ENABLED === 'true'
                    ? ContentDelivery.getMetricsCollector('node').observe
                    : undefined,
            cache: cache
                ? {
                      requestScope,
                      memory: true,
                      redis:
                          !IS_EDGE_RUNTIME && process.env.REDIS_CACHE_URL
                              ? { url: process.env.REDIS_CACHE_URL }
                              : undefined,
                      latestVersion: () =>
                          Number.parseInt(
                              requestHeaders.get('X-Newsroom-Cache-Version') ?? '0',
                              10,
                          ),
                  }
                : undefined,
        },
    );

    return adapter.usePrezlyClient();
}
