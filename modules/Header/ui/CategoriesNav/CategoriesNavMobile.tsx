import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { translations } from '@prezly/theme-kit-nextjs/index';

import { FormattedMessage } from '@/adapters/client';
import { app } from '@/adapters/server';
import { Dropdown } from '@/components/Dropdown';

import { CategoryButton } from './CategoryButton';
import { CategoryItem } from './CategoryItem';
import { FeaturedCategory } from './FeaturedCategory';

import styles from './CategoriesNavMobile.module.scss';

export async function CategoriesNavMobile({
    categories,
    localeCode,
    navigationItemClassName,
    navigationItemButtonClassName,
}: CategoriesNavMobile.Props) {
    const showAllCategories = categories.length < 4 || true;

    const categoriesList = await app().categories();

    function getCategory(translatedCategory: TranslatedCategory) {
        return categoriesList.find((i) => i.id === translatedCategory.id)!;
    }

    function isCategoryFeatured(translatedCategory: TranslatedCategory) {
        return getCategory(translatedCategory).is_featured;
    }

    const featuredCategories = categories.filter(isCategoryFeatured);
    const regularCategories = categories.filter((i) => !isCategoryFeatured(i));

    if (showAllCategories) {
        return (
            <>
                {featuredCategories.length > 0 && (
                    <li className={styles.container}>
                        <div className={styles.featuredContainer}>
                            {featuredCategories.map((translatedCategory) => (
                                <FeaturedCategory
                                    key={translatedCategory.id}
                                    className={styles.featuredItem}
                                    category={getCategory(translatedCategory)}
                                    translatedCategory={translatedCategory}
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
                    <li className={styles.container} key={category.id}>
                        <CategoryButton className={styles.categoryButton} category={category} />
                    </li>
                ))}
            </>
        );
    }

    return (
        <>
            <li className={navigationItemClassName}>
                <Dropdown
                    label={
                        <FormattedMessage locale={localeCode} for={translations.categories.title} />
                    }
                    buttonClassName={navigationItemButtonClassName}
                    withMobileDisplay
                >
                    {featuredCategories.length > 0 && (
                        <li className={styles.featuredContainer}>
                            {featuredCategories.map((category) => (
                                <FeaturedCategory
                                    key={category.id}
                                    className={styles.featuredItem}
                                    category={getCategory(category)}
                                    translatedCategory={category}
                                    size="small"
                                />
                            ))}
                        </li>
                    )}
                    {featuredCategories.length > 0 && regularCategories.length > 0 && (
                        <li>
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
        categories: TranslatedCategory[];
        localeCode: Locale.Code;
        navigationItemButtonClassName?: string;
        navigationItemClassName?: string;
    }
}
