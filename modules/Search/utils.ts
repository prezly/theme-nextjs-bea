import { ParsedUrlQuery } from 'querystring';

import { getTypedKeys } from '@/utils/getTypedKeys';

export const CATEGORY_ATTRIBUTE = 'attributes.categories.id';

// Only the attributes defined in this object will be synced with the URL
const QUERY_PARAMETER_BY_ATTRIBUTE = {
    [CATEGORY_ATTRIBUTE]: 'category',
};

type SearchFacetsState = {
    [k in keyof typeof QUERY_PARAMETER_BY_ATTRIBUTE]: string[];
};

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

    getTypedKeys(QUERY_PARAMETER_BY_ATTRIBUTE).forEach((key) => {
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
    getTypedKeys(QUERY_PARAMETER_BY_ATTRIBUTE).forEach((key) => {
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

export const createUrl = (state?: SearchState) => `?${searchStateToQuery(state)}`;
