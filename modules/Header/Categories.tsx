import { app } from '@/adapters/server';

import { CategoriesNav } from './ui';

import styles from './ui/Header.module.scss';

export async function Categories() {
    const categories = await app().translatedCategories();

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
