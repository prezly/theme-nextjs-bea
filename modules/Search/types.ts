export enum FacetAttribute {
    CATEGORY = 'attributes.categories.name',
    YEAR = 'attributes.year',
    MONTH = 'attributes.month',
}

export type SearchFacetsState = {
    [k in FacetAttribute]: string[];
};
