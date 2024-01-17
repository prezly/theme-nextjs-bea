import type { TranslatedCategory } from '@prezly/sdk';

import { CategoriesNav } from './ui';

import styles from './ui/Header.module.scss';

interface Props {
    categories: TranslatedCategory[];
}

export async function Categories({ categories }: Props) {
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
