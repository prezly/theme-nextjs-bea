import 'server-only';
import { createPrezlyClient } from '@prezly/sdk';

import { env } from '../env';

import { fetch } from './cache';
import { createContentDeliveryClient } from './lib';

/**
 * TS2352: Conversion of type `FetchCache` to type `(input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>`
 * may be a mistake because neither type sufficiently overlaps with the other.
 * Type `Promise<NFCResponse>` is not comparable to type `Promise<Response>`
 * Property `formData` is missing in type `NFCResponse` but required in type `Response`.
 */

export function api() {
    const { PREZLY_ACCESS_TOKEN, PREZLY_NEWSROOM_UUID, PREZLY_API_BASEURL } = env();

    const client = createPrezlyClient({
        fetch,
        accessToken: PREZLY_ACCESS_TOKEN,
        baseUrl: PREZLY_API_BASEURL,
    });

    return {
        api: client,
        contentDelivery: createContentDeliveryClient(client, PREZLY_NEWSROOM_UUID),
    };
}
