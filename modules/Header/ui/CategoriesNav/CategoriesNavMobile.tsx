import type { Category, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs/index';

import { FormattedMessage } from '@/adapters/client';
import { Dropdown } from '@/components/Dropdown';

import { CategoryItem } from './CategoryItem';
import { FeaturedCategory } from './FeaturedCategory';

import styles from './CategoriesNavMobile.module.scss';

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

    return (
        <>
            <li className={navigationItemClassName}>
                <Dropdown
                    label={
                        <FormattedMessage locale={localeCode} for={translations.categories.title} />
                    }
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
                    {featuredCategories.length > 0 && regularCategories.length > 0 && (
                        <hr className={styles.divider} />
                    )}
                    {regularCategories.length > 0 && (
                        <div className={styles.regularContainer}>
                            {regularCategories.map((category) => (
                                <CategoryItem key={category.id} category={category} />
                            ))}
                        </div>
                    )}
                </Dropdown>
            </li>
        </>
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
