import {
    getLocalizedCategoryData as getCategoryTranslation,
    getCategoryHasTranslation as isCategoryTranslatedTo,
} from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';

import { api, routing } from '@/theme-kit';
import { intl } from '@/theme-kit/intl/server';

import { CategoriesNav } from './ui';

import styles from './ui/Header.module.scss';

export async function Categories() {
    const { locale: localeCode } = await intl();
    const { contentDelivery } = api();
    const categories = await contentDelivery.categories();
    const { generateUrl } = await routing();

    const displayedCategories = categories
        .filter((category) => category.public_stories_number > 0)
        .filter((category) => isCategoryTranslatedTo(category, localeCode))
        .map((category) => {
            const { slug, name, description } = getCategoryTranslation(category, localeCode);
            if (!slug) {
                return undefined;
            }
            const href = generateUrl('category', { slug });

            return { id: category.id, href, name, description };
        })
        .filter(isNotUndefined);

    if (displayedCategories.length === 0) {
        return null;
    }

    return (
        <CategoriesNav
            categories={displayedCategories}
            buttonClassName={styles.navigationButton}
            navigationItemClassName={styles.navigationItem}
            navigationButtonClassName={styles.navigationButton}
        />
    );
}
