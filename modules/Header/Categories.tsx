import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import { CategoriesNav } from './ui';

import styles from './ui/Header.module.scss';

interface Props {
    localeCode: Locale.Code;
}

export async function Categories({ localeCode }: Props) {
    const categories = await app().translatedCategories(localeCode);

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
