export enum FacetAttribute {
    CATEGORY = 'attributes.categories.name',
    YEAR = 'attributes.year',
    MONTH = 'attributes.month',
}

export type SearchFacetsState = {
    [K in FacetAttribute]: string[];
};

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
