import { z } from 'zod';

import { integrateEnvironment } from '@/theme-kit/server';

const Schema = z
    .object({
        NEXT_PUBLIC_BASE_URL: z.string().optional(),

        PREZLY_ACCESS_TOKEN: z.string(),
        PREZLY_NEWSROOM_UUID: z.string(),
        PREZLY_THEME_UUID: z.string().optional(),
        PREZLY_API_BASEURL: z.string().optional(),

        ALGOLIA_API_KEY: z.string().optional(),
        ALGOLIA_APP_ID: z.string().optional(),
        ALGOLIA_INDEX: z.string().optional(),

        PREZLY_MODE: z.string().optional(),
    })
    .catchall(z.string());

export type Environment = z.infer<typeof Schema>;

export const { useEnvironment: environment } = integrateEnvironment(Schema.parse);
