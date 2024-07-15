import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import algoliasearch from 'algoliasearch';

import type { SearchSettings } from 'types';

export function getSearchClient(settings: SearchSettings) {
    return settings.searchBackend === 'algolia'
        ? algoliasearch(settings.appId, settings.apiKey)
        : instantMeiliSearch(settings.host, settings.apiKey).searchClient;
}
