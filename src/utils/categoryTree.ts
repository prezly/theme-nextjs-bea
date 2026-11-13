import type { Category, TranslatedCategory } from '@prezly/sdk';

type WithParent = Pick<Category, 'id' | 'parent_id'>;

export interface CategoryNode {
    category: TranslatedCategory;
    children: CategoryNode[];
}

/**
 * Turns the flat list of categories shown in a locale into a tree.
 *
 * @param categories Every category of the site: they say which category is under which.
 * @param translatedCategories The categories to show, in the order to show them.
 *
 * A category whose parent is not shown (it has no translation in this locale) moves up to the
 * nearest ancestor that is, or to the top level. So no category is lost from the menu.
 */
export function buildCategoryTree(
    categories: WithParent[],
    translatedCategories: TranslatedCategory[],
): CategoryNode[] {
    const nodes = new Map<Category['id'], CategoryNode>(
        translatedCategories.map((category) => [category.id, { category, children: [] }]),
    );
    const roots: CategoryNode[] = [];

    translatedCategories.forEach(({ id }) => {
        const node = nodes.get(id);
        if (!node) return;

        const parent = getAncestorIds(categories, id)
            .map((ancestorId) => nodes.get(ancestorId))
            .find(Boolean);

        (parent ? parent.children : roots).push(node);
    });

    return roots;
}

/**
 * The categories above a category that are shown in the locale, from the top level down:
 * for EQS, that is Cars and then Models.
 */
export function getCategoryAncestors(
    categories: WithParent[],
    translatedCategories: TranslatedCategory[],
    id: Category['id'],
): TranslatedCategory[] {
    return getAncestorIds(categories, id)
        .map((ancestorId) => translatedCategories.find((category) => category.id === ancestorId))
        .filter((category): category is TranslatedCategory => Boolean(category))
        .reverse();
}

/**
 * The categories directly under a category that are shown in the locale.
 */
export function getSubcategories(
    categories: WithParent[],
    translatedCategories: TranslatedCategory[],
    id: Category['id'],
): TranslatedCategory[] {
    return (
        findNode(buildCategoryTree(categories, translatedCategories), id)?.children.map(
            (node) => node.category,
        ) ?? []
    );
}

/**
 * The categories to show on a story: its most specific ones.
 *
 * A story in "EQS" is in "Models" and in "Cars" too, and does not need to say so. A category is
 * left out when another category of the list is directly under it.
 */
export function withoutParentCategories<
    T extends { id: Category['id']; parent_id?: number | null },
>(categories: T[]): T[] {
    const parentIds = new Set(categories.map((category) => category.parent_id));

    return categories.filter((category) => !parentIds.has(category.id));
}

/**
 * Every category of a tree, parents before their children, with how deep it is (0 at the top).
 */
export function flattenCategoryTree(
    tree: CategoryNode[],
    depth = 0,
): { category: TranslatedCategory; depth: number }[] {
    return tree.flatMap((node) => [
        { category: node.category, depth },
        ...flattenCategoryTree(node.children, depth + 1),
    ]);
}

export function hasSubcategories(tree: CategoryNode[]): boolean {
    return tree.some((node) => node.children.length > 0);
}

function findNode(tree: CategoryNode[], id: Category['id']): CategoryNode | undefined {
    for (const node of tree) {
        if (node.category.id === id) return node;

        const found = findNode(node.children, id);
        if (found) return found;
    }

    return undefined;
}

/**
 * Nearest first: the parent, then its parent, up to the top level.
 */
function getAncestorIds(categories: WithParent[], id: Category['id']): Category['id'][] {
    const parents = new Map(categories.map((category) => [category.id, category.parent_id]));
    const ancestors: Category['id'][] = [];

    let current = parents.get(id) ?? null;
    // The `includes` guard keeps a broken (cyclic) tree from looping forever.
    while (current !== null && current !== id && !ancestors.includes(current)) {
        ancestors.push(current);
        current = parents.get(current) ?? null;
    }

    return ancestors;
}
