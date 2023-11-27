// @ts-ignore
import { Story } from '@prezly/sdk';
import { PrezlyAdapter } from '@prezly/theme-kit-nextjs/server';

import { environment } from './environment';

const CACHE_TTL = 5000; // milliseconds

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
            headers: {
                'x-newsroom-uuid': env.PREZLY_NEWSROOM_UUID,
            },
        };
    },
    {
        ttl: CACHE_TTL,
        debug: true,
    },
);

/**
 * @internal Using this adapter directly is rarely needed. You should be good using `app()` in most of the cases.
 */
export const initPrezlyClient = usePrezlyClient;
