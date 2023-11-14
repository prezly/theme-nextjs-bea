import { createCachedFetch, createDedupedFetch, createMemoryStore } from '@e1himself/cached-fetch';

import { getCacheKey } from './cacheKey';
import type { Options as StoreOptions } from './store';
import { createSelfExpiringMemoryStore } from './store';

const globalFetch = fetch;

type Awaitable<T> = T | Promise<T>;

export function createFetch(options: StoreOptions = {}): typeof globalFetch {
    const cache =
        options.ttl === Infinity
            ? createMemoryStore<Awaitable<Response>>()
            : createSelfExpiringMemoryStore<Awaitable<Response>>(options);

    const dedupeStore = createMemoryStore<Promise<Response>>();
    const fetch = createDedupedFetch(
        createCachedFetch(globalFetch, {
            cache,
            getCacheKey,
        }),
        {
            cache: dedupeStore,
            getCacheKey,
        },
    );

    return (...args) => {
        const key = getCacheKey(...args);
        if (key && dedupeStore.has(key)) {
            console.info('Deduping request', args[0]);
        }
        if (key) {
            console.info(
                cache.has(key) ? 'Cache HIT on request' : 'Cache MISS on request',
                args[0],
            );
        }
        return fetch(...args);
    };
}
