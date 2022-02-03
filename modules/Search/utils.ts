import type { ParsedUrlQuery } from 'querystring';

import { getTypedKeys } from '@/utils/getTypedKeys';

import type { SearchFacetsState } from './types';
import { FacetAttribute } from './types';

// Only the attributes defined in this object will be synced with the URL
const QUERY_PARAMETER_BY_ATTRIBUTE = {
    [FacetAttribute.CATEGORY]: 'category',
    [FacetAttribute.YEAR]: 'year',
    [FacetAttribute.MONTH]: 'month',
};

export const AVAILABLE_FACET_ATTRIBUTES = getTypedKeys(QUERY_PARAMETER_BY_ATTRIBUTE);
export interface SearchState extends Record<string, any> {
    query: string;
    page: number;
    refinementList?: Partial<SearchFacetsState>;
}

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

export function queryToSearchState(urlQuery: ParsedUrlQuery): SearchState {
    const { query } = urlQuery;

    const refinementList: Partial<SearchFacetsState> = {};
    AVAILABLE_FACET_ATTRIBUTES.forEach((key) => {
        const items = urlQuery[QUERY_PARAMETER_BY_ATTRIBUTE[key]];
        if (items && items.length) {
            refinementList[key] = Array.isArray(items) ? items : [items];
        }
    });

    return {
        query: typeof query === 'string' ? query : '',
        page: 1,
        ...(Object.keys(refinementList).length && {
            refinementList,
        }),
    };
}

export function createUrl(state?: SearchState) {
    return `?${searchStateToQuery(state)}`;
}
