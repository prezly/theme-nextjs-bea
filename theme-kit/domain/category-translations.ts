/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Category, Culture } from '@prezly/sdk';
import { isNotUndefined } from '@technically/is-not-undefined';

export interface TranslatedCategory {
    id: Category['id'];
    code: Culture['code'];
    slug: NonNullable<Category.Translation['slug']>;
    name: Category.Translation['name'];
    description: Category.Translation['description'];
}

export function categoryTranslations(category: Category): TranslatedCategory[];
export function categoryTranslations(categories: Category[]): TranslatedCategory[];
export function categoryTranslations(
    categories: Category[],
    locale: Culture['code'],
): TranslatedCategory[];
export function categoryTranslations(
    categoryOrCategories: Category | Category[],
    localeCode?: Culture['code'],
): TranslatedCategory[] {
    const categories = Array.isArray(categoryOrCategories)
        ? categoryOrCategories
        : [categoryOrCategories];

    if (localeCode) {
        return categories
            .map((category) => categoryTranslation(category, localeCode))
            .filter(isNotUndefined);
    }

    return categories.flatMap((category) =>
        Object.keys(category.i18n)
            .map((code) => categoryTranslation(category, code as Culture['code']))
            .filter(isNotUndefined),
    );
}

export function categoryTranslation(
    category: Category,
    localeCode: Culture['code'],
): TranslatedCategory | undefined {
    const i18n = category.i18n[localeCode];

    if (!i18n) return undefined;

    const { slug, name, description } = i18n;

    if (slug && name) {
        return {
            id: category.id,
            code: i18n.locale.code,
            slug,
            name,
            description,
        };
    }

    return undefined;
}
