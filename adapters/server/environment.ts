import { Environment as Env } from '@prezly/theme-kit-nextjs';
import { headers } from 'next/headers';
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

    ALGOLIA_API_KEY: z.string().optional(),
    ALGOLIA_APP_ID: z.string().optional(),
    ALGOLIA_INDEX: z.string().optional(),

    PREZLY_MODE: z.string().optional(),
});

export type Environment = z.infer<typeof Schema>;

export function environment(requestHeaders: Headers = headers()): Environment {
    const httpEnvHeader = requestHeaders.get('X-Prezly-Env');
    const variables = Env.combine(process.env, httpEnvHeader);

    return Schema.parse(variables);
}
