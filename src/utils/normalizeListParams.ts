import type { ContentDelivery } from '@prezly/theme-kit-nextjs';

/** Match the effective SDK arguments before ContentDelivery serializes its key. */
export function normalizeStoryListParams(params: ContentDelivery.stories.SearchParams) {
    return {
        search: params.search,
        categories: params.categories?.length
            ? params.categories.map(({ id }) => ({ id }))
            : undefined,
        tags: params.tags?.length ? params.tags : undefined,
        locale: typeof params.locale === 'object' ? params.locale.code : params.locale,
        limit: params.limit,
        offset: params.offset ?? 0,
        highlighted: params.highlighted ?? 0,
        query: params.query,
    };
}

export function normalizeGalleryListParams(params: ContentDelivery.galleries.SearchParams = {}) {
    return { offset: params.offset ?? 0, limit: params.limit, type: params.type };
}
