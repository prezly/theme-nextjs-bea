import type { Category, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { CategoriesNav } from './CategoriesNav';

import styles from './Header.module.scss';

interface Props {
    categories: Category[];
    localeCode: Locale.Code;
    marginTop: number | undefined;
    translatedCategories: TranslatedCategory[];
}

export function Categories({ categories, localeCode, marginTop, translatedCategories }: Props) {
    if (translatedCategories.length === 0) {
        return null;
    }

    return (
        <CategoriesNav
            buttonClassName={styles.navigationButton}
            categories={categories}
            localeCode={localeCode}
            marginTop={marginTop}
            navigationButtonClassName={styles.navigationButton}
            navigationItemClassName={styles.navigationItem}
            translatedCategories={translatedCategories}
        />
    );
}
