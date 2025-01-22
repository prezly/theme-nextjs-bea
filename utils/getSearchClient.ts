import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

import type { SearchSettings } from '@/types';

export function getSearchClient(settings: SearchSettings) {
    return instantMeiliSearch(settings.host, settings.apiKey).searchClient;
}
