import { getTypedKeys } from '@/utils/getTypedKeys';

import type { SearchFacetsState, SearchState } from './types';
import { FacetAttribute } from './types';

// Only the attributes defined in this object will be synced with the URL
const QUERY_PARAMETER_BY_ATTRIBUTE = {
    [FacetAttribute.CATEGORY]: 'category',
    [FacetAttribute.YEAR]: 'year',
    [FacetAttribute.MONTH]: 'month',
};

export const AVAILABLE_FACET_ATTRIBUTES = getTypedKeys(QUERY_PARAMETER_BY_ATTRIBUTE);

export function searchStateToQuery(state?: SearchState): string {
    if (!state) {
        return '';
    }

    const { refinementList, query } = state;

    const searchParams = new URLSearchParams({ query });

    AVAILABLE_FACET_ATTRIBUTES.forEach((key) => {
        const items = refinementList?.[key];
        if (items) {
            items.forEach((item) => {
                searchParams.append(QUERY_PARAMETER_BY_ATTRIBUTE[key], item);
            });
        }
    });

    return searchParams.toString();
}

export function queryToSearchState(params: URLSearchParams): SearchState {
    // FIXME: Make this work with `ReadonlyURLSearchParams`

    const query = params.get('query') ?? '';

    const refinementList: Partial<SearchFacetsState> = {};
    AVAILABLE_FACET_ATTRIBUTES.forEach((key) => {
        refinementList[key] = params.getAll(QUERY_PARAMETER_BY_ATTRIBUTE[key]);
    });

    return {
        query,
        page: 1,
        refinementList: Object.keys(refinementList).length > 0 ? refinementList : undefined,
    };
}

export function createUrl(state?: SearchState) {
    return `?${searchStateToQuery(state)}`;
}
