import { expect, test } from '@playwright/test';

import { FacetAttribute } from '../src/modules/Search/types';
import { queryToSearchState, searchStateToQuery } from '../src/modules/Search/utils';

test('a site without subcategories filters categories by name', () => {
    const state = queryToSearchState(new URLSearchParams('query=eqs&category=News&year=2026'), false);

    expect(state.refinementList?.[FacetAttribute.CATEGORY]).toEqual(['News']);
    expect(state.refinementList?.[FacetAttribute.CATEGORY_ID]).toBeUndefined();
    expect(searchStateToQuery(state, false)).toBe('query=eqs&category=News&year=2026');
});

test('a site with subcategories filters categories by ID', () => {
    const state = queryToSearchState(new URLSearchParams('category=12&category=15'), true);

    expect(state.refinementList?.[FacetAttribute.CATEGORY_ID]).toEqual(['12', '15']);
    expect(state.refinementList?.[FacetAttribute.CATEGORY]).toBeUndefined();
    expect(searchStateToQuery(state, true)).toBe('category=12&category=15');
});

test('a category name in the URL is dropped on a site with subcategories', () => {
    const state = queryToSearchState(new URLSearchParams('query=eqs&category=News'), true);

    expect(state.query).toBe('eqs');
    expect(state.refinementList?.[FacetAttribute.CATEGORY_ID]).toEqual([]);
});
