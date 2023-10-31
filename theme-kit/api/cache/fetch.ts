import { createCachedFetch, createDedupedFetch, createMemoryStore } from '@e1himself/cached-fetch';

import { getCacheKey } from './getCacheKey';
import type { Options as StoreOptions } from './store';
import { createSelfExpiringMemoryStore } from './store';

const globalFetch = fetch;

type Awaitable<T> = T | Promise<T>;

export function createFetch(options?: StoreOptions) {
    const cache = createSelfExpiringMemoryStore<Awaitable<Response>>(options);
    const dedupeStore = createMemoryStore<Promise<Response>>();
    return createDedupedFetch(
        createCachedFetch(globalFetch, {
            cache,
            getCacheKey,
        }),
        {
            cache: dedupeStore,
            getCacheKey,
        },
    );
}
