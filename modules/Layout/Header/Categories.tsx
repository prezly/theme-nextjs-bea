import { displayedCategories } from '@/theme-kit';

import { CategoriesNav } from './ui';

import styles from './ui/Header.module.scss';

export async function Categories() {
    const categories = await displayedCategories();

    if (categories.length === 0) {
        return null;
    }

    return (
        <CategoriesNav
            categories={categories}
            buttonClassName={styles.navigationButton}
            navigationItemClassName={styles.navigationItem}
            navigationButtonClassName={styles.navigationButton}
        />
    );
}
