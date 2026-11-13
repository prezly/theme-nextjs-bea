import type { Category, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs/index';
import { Fragment } from 'react';

import { FormattedMessage } from '@/adapters/client';
import { Dropdown } from '@/components/Dropdown';
import { buildCategoryTree, hasSubcategories } from '@/utils';

import { CategoryItem } from './CategoryItem';
import { FeaturedCategory } from './FeaturedCategory';

import styles from './CategoriesNavMobile.module.scss';

/**
 * Subcategories listed under a top-level category in the menu. The rest are on its page.
 */
const MAX_SUBCATEGORIES = 6;

export function CategoriesNavMobile({
    categories,
    translatedCategories,
    localeCode,
    navigationItemClassName,
    navigationItemButtonClassName,
}: CategoriesNavMobile.Props) {
    const showAllCategories = translatedCategories.length < 4;

    function getCategory(translatedCategory: TranslatedCategory) {
        return categories.find((i) => i.id === translatedCategory.id)!;
    }

    function isCategoryFeatured(translatedCategory: TranslatedCategory) {
        return getCategory(translatedCategory).is_featured;
    }

    const featuredCategories = translatedCategories.filter(isCategoryFeatured);
    const regularCategories = translatedCategories.filter((i) => !isCategoryFeatured(i));

    // With subcategories, the list shows two levels: every top-level category, with its
    // subcategories indented below it. A third level is on the page of its parent.
    const tree = buildCategoryTree(categories, translatedCategories);
    // A featured category has its tile above the list, at any level, so it is left out of the
    // list: it would be in the menu twice.
    const groups = hasSubcategories(tree)
        ? tree
              .map((node) => ({
                  ...node,
                  children: node.children.filter((child) => !isCategoryFeatured(child.category)),
              }))
              .filter((node) => node.children.length > 0 || !isCategoryFeatured(node.category))
        : [];
    const hasRegularCategories = groups.length > 0 || regularCategories.length > 0;

    return (
        <li className={navigationItemClassName}>
            <Dropdown
                label={<FormattedMessage locale={localeCode} for={translations.categories.title} />}
                menuAs="div"
                menuClassName={styles.dropdown}
                buttonClassName={navigationItemButtonClassName}
                withMobileDisplay
                forceOpen={showAllCategories}
            >
                {featuredCategories.length > 0 && (
                    <div className={styles.featuredContainer}>
                        {featuredCategories.map((category) => (
                            <FeaturedCategory
                                key={category.id}
                                category={getCategory(category)}
                                translatedCategory={category}
                            />
                        ))}
                    </div>
                )}
                {featuredCategories.length > 0 && hasRegularCategories && (
                    <hr className={styles.divider} />
                )}
                {groups.length > 0 && (
                    <ul className={styles.regularContainer}>
                        {groups.map((node) => (
                            <Fragment key={node.category.id}>
                                <CategoryItem category={node.category} />
                                {node.children.slice(0, MAX_SUBCATEGORIES).map(({ category }) => (
                                    <CategoryItem
                                        key={category.id}
                                        category={category}
                                        isSubcategory
                                    />
                                ))}
                                {node.children.length > MAX_SUBCATEGORIES && (
                                    <CategoryItem category={node.category} isSubcategory>
                                        <FormattedMessage
                                            locale={localeCode}
                                            for={translations.search.viewMore}
                                        />
                                    </CategoryItem>
                                )}
                            </Fragment>
                        ))}
                    </ul>
                )}
                {groups.length === 0 && regularCategories.length > 0 && (
                    <ul className={styles.regularContainer}>
                        {regularCategories.map((category) => (
                            <CategoryItem key={category.id} category={category} />
                        ))}
                    </ul>
                )}
            </Dropdown>
        </li>
    );
}

export namespace CategoriesNavMobile {
    export interface Props {
        categories: Category[];
        translatedCategories: TranslatedCategory[];
        localeCode: Locale.Code;
        navigationItemButtonClassName?: string;
        navigationItemClassName?: string;
    }
}
