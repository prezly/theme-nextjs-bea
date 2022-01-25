import type { Category } from '@prezly/sdk';

import { AlgoliaCategoryRef } from 'types';

import { LocaleObject } from '../localeObject';

function isAlgoliaCategory(
    category: Category | AlgoliaCategoryRef,
): category is AlgoliaCategoryRef {
    return 'name' in category && 'slug' in category;
}

export function getLocalizedCategoryData(
    category: Category | AlgoliaCategoryRef,
    locale: LocaleObject,
) {
    if (isAlgoliaCategory(category)) {
        return {
            description: null,
            name: category.name,
            slug: category.slug,
        };
    }

    const targetLocaleCode = locale.toUnderscoreCode();
    const { i18n } = category;
    const populatedLocales = Object.keys(i18n).filter((localeCode) => i18n[localeCode].name);
    const targetLocale =
        populatedLocales.find((localeCode) => localeCode === targetLocaleCode) ||
        populatedLocales.find((localeCode) => i18n[localeCode].name === category.display_name) ||
        populatedLocales[0];

    const { locale: _, ...localizedData } = i18n[targetLocale];

    return localizedData;
}

export function getCategoryUrl(category: Category | AlgoliaCategoryRef, locale: LocaleObject) {
    const { slug } = getLocalizedCategoryData(category, locale);
    return `/category/${slug}`;
}

export function getCategoryHasTranslation(category: Category, locale: LocaleObject) {
    const targetLocaleCode = locale.toUnderscoreCode();
    const { i18n } = category;
    const populatedLocales = Object.keys(i18n).filter((localeCode) => i18n[localeCode].name);
    return Boolean(populatedLocales.find((localeCode) => localeCode === targetLocaleCode));
}
