import { Environment as Env } from '@prezly/theme-kit-nextjs';
import { headers, type UnsafeUnwrappedHeaders } from 'next/headers';
import { z } from 'zod';

const Schema = z.object({
    NEXT_PUBLIC_BASE_URL: z.string().optional(),

    REDIS_CACHE_URL: z.string().optional(),

    PREZLY_ACCESS_TOKEN: z.string(),
    PREZLY_NEWSROOM_UUID: z.string(),
    PREZLY_THEME_UUID: z.string().optional(),
    PREZLY_API_BASEURL: z.string().optional(),

    MEILISEARCH_API_KEY: z.string().optional(),
    MEILISEARCH_HOST: z.string().optional(),
    MEILISEARCH_INDEX: z.string().optional(),

    PREZLY_MODE: z.string().optional(),

    /**
     * Comma-separated list of ancestor hub UUIDs from outermost to innermost.
     * Used by HubBreadcrumbs to build the navigation trail above this newsroom.
     * Hub names and URLs are fetched at runtime from the Prezly API.
     *
     * Example (two levels above the current newsroom):
     *   PREZLY_HUB_ANCESTRY=uuid-root-hub,uuid-regional-hub
     *
     * Leave unset on standalone or root-hub deployments — the component renders nothing.
     */
    PREZLY_HUB_ANCESTRY: z.string().optional(),
});

export type Environment = z.infer<typeof Schema>;

export function environment(
    requestHeaders: Headers = headers() as unknown as UnsafeUnwrappedHeaders,
): Environment {
    const httpEnvHeader = requestHeaders.get('X-Prezly-Env');
    const variables = Env.combine(process.env, httpEnvHeader);

    return Schema.parse(variables);
}
