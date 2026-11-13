import type { SearchFacetsState, SearchState } from './types';
import { FacetAttribute } from './types';

// Only the attributes defined in this object will be synced with the URL
const QUERY_PARAMETER_BY_ATTRIBUTE = {
    [FacetAttribute.CATEGORY]: 'category',
    [FacetAttribute.CATEGORY_ID]: 'category',
    [FacetAttribute.YEAR]: 'year',
    [FacetAttribute.MONTH]: 'month',
};

/**
 * The filters of the search page. Categories are one filter: by name, or by ID on a site with
 * subcategories. Both use the `category` URL parameter.
 */
export function getFacetAttributes(withCategoryTree: boolean): FacetAttribute[] {
    return [
        withCategoryTree ? FacetAttribute.CATEGORY_ID : FacetAttribute.CATEGORY,
        FacetAttribute.YEAR,
        FacetAttribute.MONTH,
    ];
}

export function searchStateToQuery(
    state: SearchState | undefined,
    withCategoryTree: boolean,
): string {
    if (!state) {
        return '';
    }

    const { refinementList, query } = state;

    const searchParams = new URLSearchParams(query !== '' ? { query } : {});

    getFacetAttributes(withCategoryTree).forEach((key) => {
        const items = refinementList?.[key];
        if (items) {
            items.forEach((item) => {
                searchParams.append(QUERY_PARAMETER_BY_ATTRIBUTE[key], item);
            });
        }
    });

    return searchParams.toString();
}

export function queryToSearchState(
    params: URLSearchParams,
    withCategoryTree: boolean,
): SearchState {
    const query = params.get('query') ?? '';

    const refinementList: Partial<SearchFacetsState> = {};
    getFacetAttributes(withCategoryTree).forEach((key) => {
        const values = params.getAll(QUERY_PARAMETER_BY_ATTRIBUTE[key]);
        // A link from before the site had subcategories has a category name here. It cannot be
        // filtered on by ID, so it is dropped: the search still runs, without that filter.
        refinementList[key] =
            key === FacetAttribute.CATEGORY_ID
                ? values.filter((value) => /^\d+$/.test(value))
                : values;
    });

    return {
        query,
        page: 1,
        refinementList: Object.keys(refinementList).length > 0 ? refinementList : undefined,
    };
}

export function createUrl(state: SearchState | undefined, withCategoryTree: boolean) {
    return `?${searchStateToQuery(state, withCategoryTree)}`;
}
