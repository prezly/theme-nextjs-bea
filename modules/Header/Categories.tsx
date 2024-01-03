import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import { CategoriesNav } from './ui';

import styles from './ui/Header.module.scss';

interface Props {
    localeCode: Locale.Code;
}

export async function Categories({ localeCode }: Props) {
    const categories = await app().categories();
    const displayedCategories = await app().translatedCategories(
        localeCode,
        categories.filter((category) => category.public_stories_number > 0),
    );

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
