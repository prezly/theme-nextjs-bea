import { ParsedUrlQuery } from 'querystring';

import { getTypedKeys } from '@/utils/getTypedKeys';

export const CATEGORY_ATTRIBUTE = 'attributes.categories.name';
export const YEAR_ATTRIBUTE = 'attributes.year';
export const MONTH_ATTRIBUTE = 'attributes.month';

// Only the attributes defined in this object will be synced with the URL
const QUERY_PARAMETER_BY_ATTRIBUTE = {
    [CATEGORY_ATTRIBUTE]: 'category',
    [YEAR_ATTRIBUTE]: 'year',
    [MONTH_ATTRIBUTE]: 'month',
};

export const AVAILABLE_FACET_ATTRIBUTES = getTypedKeys(QUERY_PARAMETER_BY_ATTRIBUTE);
type AvailalbeFacetAttribute = keyof typeof QUERY_PARAMETER_BY_ATTRIBUTE;

type SearchFacetsState = {
    [k in AvailalbeFacetAttribute]: string[];
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

export const createUrl = (state?: SearchState) => `?${searchStateToQuery(state)}`;
