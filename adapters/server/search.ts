import type { SearchSettings } from 'types';

import { environment } from './environment';

export function getSearchSettings(): SearchSettings | undefined {
    const {
        ALGOLIA_API_KEY,
        ALGOLIA_APP_ID,
        ALGOLIA_INDEX,
        MEILISEARCH_API_KEY,
        MEILISEARCH_HOST,
        MEILISEARCH_INDEX,
    } = environment();

    if (MEILISEARCH_API_KEY && MEILISEARCH_HOST && MEILISEARCH_INDEX) {
        return {
            apiKey: MEILISEARCH_API_KEY,
            host: MEILISEARCH_HOST,
            index: MEILISEARCH_INDEX,
            searchBackend: 'meilisearch',
        };
    }

    if (ALGOLIA_API_KEY && ALGOLIA_APP_ID && ALGOLIA_INDEX) {
        return {
            apiKey: ALGOLIA_API_KEY,
            appId: ALGOLIA_APP_ID,
            index: ALGOLIA_INDEX,
            searchBackend: 'algolia',
        };
    }

    return undefined;
}
