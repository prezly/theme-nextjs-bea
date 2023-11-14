import { Story } from '@prezly/sdk';

import { integratePrezlyClient } from '@/theme-kit/server';

import { environment } from './environment';

export const { usePrezlyClient: api } = integratePrezlyClient(
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
        ttl: process.env.NODE_ENV === 'production' ? 10000 : Infinity,
    },
);
