import 'server-only';
import { createPrezlyClient } from '@prezly/sdk';
import { fetchBuilder, MemoryCache } from 'node-fetch-cache';

import { env } from './env';
import { createContentDeliveryClient } from './lib';

const cache = new MemoryCache({ ttl: 5000 });

/**
 * TS2352: Conversion of type `FetchCache` to type `(input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>`
 * may be a mistake because neither type sufficiently overlaps with the other.
 * Type `Promise<NFCResponse>` is not comparable to type `Promise<Response>`
 * Property `formData` is missing in type `NFCResponse` but required in type `Response`.
 */
const cachedFetch = fetchBuilder.withCache(cache) as unknown as typeof fetch;

export function api() {
    const { PREZLY_ACCESS_TOKEN, PREZLY_NEWSROOM_UUID, PREZLY_API_BASEURL } = env();

    const client = createPrezlyClient({
        fetch: cachedFetch,
        accessToken: PREZLY_ACCESS_TOKEN,
        baseUrl: PREZLY_API_BASEURL,
    });

    return {
        api: client,
        contentDelivery: createContentDeliveryClient(client, PREZLY_NEWSROOM_UUID),
    };
}
