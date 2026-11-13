export enum FacetAttribute {
    CATEGORY = 'attributes.categories.name',
    /**
     * On a site with subcategories, categories are filtered by ID: names repeat across parents
     * (Cars › Events, Vans › Events), and the filter is listed as the tree of the site.
     */
    CATEGORY_ID = 'attributes.categories.id',
    YEAR = 'attributes.year',
    MONTH = 'attributes.month',
}

export type SearchFacetsState = {
    [k in FacetAttribute]: string[];
};

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

/**
 * A category of the site, as the category filter lists it on a site with subcategories.
 */
export interface FacetCategory {
    id: number;
    name: string;
    /** How deep in the tree: 0 at the top level. */
    depth: number;
}

export interface SearchState extends Record<string, any> {
    query: string;
    page: number;
    refinementList?: Partial<SearchFacetsState>;
}
