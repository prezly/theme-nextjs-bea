/**
 * The address of a category page, for URLs: `cars/models/eqs`.
 *
 * It is the slugs of the category's parents and its own, which for a top-level category is just
 * its slug. A category that comes without a path (from the search index, or from an API response
 * of before paths existed) is addressed by its slug.
 */
export function categoryPath(category: { slug: string; path?: string | null }): string {
    return category.path || category.slug;
}

/**
 * Is the page at `currentPath` the page of this category, or of a category below it?
 */
export function isCategoryPathActive(path: string, currentPath: string | undefined): boolean {
    if (!currentPath) return false;

    return currentPath === path || currentPath.startsWith(`${path}/`);
}

/**
 * The category path from the segments of a catch-all route: `['cars', 'models']` gives
 * `cars/models`. Segments that are still URL-encoded are decoded; a malformed one is kept as it
 * is, and then simply matches no category.
 */
export function categoryPathFromSegments(segments: string[]): string {
    return segments
        .map((segment) => {
            try {
                return decodeURIComponent(segment);
            } catch {
                return segment;
            }
        })
        .join('/');
}
