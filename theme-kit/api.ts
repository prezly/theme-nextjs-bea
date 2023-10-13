import { createPrezlyClient } from '@prezly/sdk';

import { assertServerEnv } from '@/utils';

import { env } from './env';
import { createContentDeliveryClient } from './lib';

export function api() {
    assertServerEnv('api');

    const { PREZLY_ACCESS_TOKEN, PREZLY_NEWSROOM_UUID, PREZLY_API_BASEURL } = env();

    const client = createPrezlyClient({
        accessToken: PREZLY_ACCESS_TOKEN,
        baseUrl: PREZLY_API_BASEURL,
    });

    return {
        api: client,
        contentDelivery: createContentDeliveryClient(client, PREZLY_NEWSROOM_UUID),
    };
}
