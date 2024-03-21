import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { CategoriesNav } from './ui';

import styles from './ui/Header.module.scss';

interface Props {
    categories: TranslatedCategory[];
    localeCode: Locale.Code;
}

export async function Categories({ categories, localeCode }: Props) {
    if (categories.length === 0) {
        return null;
    }

    return (
        <CategoriesNav
            localeCode={localeCode}
            translatedCategories={categories}
            buttonClassName={styles.navigationButton}
            navigationItemClassName={styles.navigationItem}
            navigationButtonClassName={styles.navigationButton}
        />
    );
}
