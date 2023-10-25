import 'server-only';
import { createPrezlyClient } from '@prezly/sdk';

import { env } from './env';
import { createContentDeliveryClient } from './lib';

export function api() {
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
