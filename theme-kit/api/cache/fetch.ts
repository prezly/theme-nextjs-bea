import { createCachedFetch, createDedupedFetch } from '@e1himself/cached-fetch';

import { getCacheKey } from './getCacheKey';
import type { Options as StoreOptions } from './store';
import { createSelfExpiringMemoryStore } from './store';

const globalFetch = fetch;

export function createFetch(options?: StoreOptions) {
    return createDedupedFetch(
        createCachedFetch(globalFetch, {
            cache: createSelfExpiringMemoryStore(options),
            getCacheKey,
        }),
    );
}
