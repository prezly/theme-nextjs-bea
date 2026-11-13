import type { TranslatedCategory } from '@prezly/sdk';
import { expect, test } from '@playwright/test';

import {
    buildCategoryTree,
    getCategoryAncestors,
    getSubcategories,
    hasSubcategories,
} from '../src/utils/categoryTree';

function translated(id: number, name: string): TranslatedCategory {
    return {
        id,
        locale: 'en',
        name,
        slug: name.toLowerCase(),
        description: null,
        public_stories_number: 1,
    };
}

// Cars › Models › EQS, Cars › Events, Vans
const categories = [
    { id: 1, parent_id: null },
    { id: 2, parent_id: 1 },
    { id: 3, parent_id: 2 },
    { id: 4, parent_id: 1 },
    { id: 5, parent_id: null },
];
const cars = translated(1, 'Cars');
const models = translated(2, 'Models');
const eqs = translated(3, 'EQS');
const events = translated(4, 'Events');
const vans = translated(5, 'Vans');

const names = (tree: ReturnType<typeof buildCategoryTree>): unknown[] =>
    tree.map((node) => (node.children.length ? [node.category.name, names(node.children)] : node.category.name));

test.describe('buildCategoryTree', () => {
    test('puts every category under its parent, in the order given', () => {
        const tree = buildCategoryTree(categories, [cars, models, eqs, events, vans]);

        expect(names(tree)).toEqual([['Cars', [['Models', ['EQS']], 'Events']], 'Vans']);
        expect(hasSubcategories(tree)).toBe(true);
    });

    test('moves a category up when its parent is not shown', () => {
        // Models has no translation, or no public stories, in this language.
        expect(names(buildCategoryTree(categories, [cars, eqs, vans]))).toEqual([
            ['Cars', ['EQS']],
            'Vans',
        ]);
        // Neither has Cars.
        expect(names(buildCategoryTree(categories, [eqs, events, vans]))).toEqual([
            'EQS',
            'Events',
            'Vans',
        ]);
    });

    test('is a flat list for a site without subcategories', () => {
        const flat = [
            { id: 1, parent_id: null },
            { id: 5, parent_id: null },
        ];
        const tree = buildCategoryTree(flat, [cars, vans]);

        expect(names(tree)).toEqual(['Cars', 'Vans']);
        expect(hasSubcategories(tree)).toBe(false);
    });

    test('survives a category that is its own ancestor', () => {
        const broken = [
            { id: 1, parent_id: 2 },
            { id: 2, parent_id: 1 },
        ];

        expect(() => buildCategoryTree(broken, [cars, models])).not.toThrow();
    });
});

test.describe('getCategoryAncestors', () => {
    test('lists the categories above a category, from the top down', () => {
        const all = [cars, models, eqs, events, vans];

        expect(getCategoryAncestors(categories, all, 3).map((c) => c.name)).toEqual(['Cars', 'Models']);
        expect(getCategoryAncestors(categories, all, 1)).toEqual([]);
        // An ancestor that is not shown is left out.
        expect(getCategoryAncestors(categories, [cars, eqs], 3).map((c) => c.name)).toEqual(['Cars']);
    });
});

test.describe('getSubcategories', () => {
    test('lists the categories directly under a category', () => {
        const all = [cars, models, eqs, events, vans];

        expect(getSubcategories(categories, all, 1).map((c) => c.name)).toEqual(['Models', 'Events']);
        expect(getSubcategories(categories, all, 2).map((c) => c.name)).toEqual(['EQS']);
        expect(getSubcategories(categories, all, 5)).toEqual([]);
    });
});
