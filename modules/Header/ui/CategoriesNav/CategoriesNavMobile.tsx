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
                    buttonClassName={navigationItemButtonClassName}
                    withMobileDisplay
                    forceOpen={showAllCategories}
                >
                    {featuredCategories.length > 0 && (
                        <li className={styles.container}>
                            <div className={styles.featuredContainer}>
                                {featuredCategories.map((category) => (
                                    <FeaturedCategory
                                        key={category.id}
                                        className={styles.featuredItem}
                                        category={getCategory(category)}
                                        translatedCategory={category}
                                        size="small"
                                    />
                                ))}
                            </div>
                        </li>
                    )}
                    {featuredCategories.length > 0 && regularCategories.length > 0 && (
                        <li className={styles.container}>
                            <hr className={styles.divider} />
                        </li>
                    )}
                    {regularCategories.map((category) => (
                        <CategoryItem key={category.id} category={category} />
                    ))}
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
