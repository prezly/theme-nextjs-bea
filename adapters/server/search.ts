import type { SearchSettings } from 'types';

import { environment } from './environment';

export function getSearchSettings(): SearchSettings | undefined {
    const {
        MEILISEARCH_API_KEY = '',
        MEILISEARCH_HOST = 'https://search.prezly.com',
        MEILISEARCH_INDEX = 'public_stories',
    } = environment();

    if (MEILISEARCH_API_KEY && MEILISEARCH_HOST && MEILISEARCH_INDEX) {
        return {
            apiKey: MEILISEARCH_API_KEY,
            host: MEILISEARCH_HOST,
            index: MEILISEARCH_INDEX,
            searchBackend: 'meilisearch',
        };
    }

    return undefined;
}
