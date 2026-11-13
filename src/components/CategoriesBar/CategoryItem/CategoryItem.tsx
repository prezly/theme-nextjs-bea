import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { DropdownItem } from '@/components/Dropdown';
import { categoryPath } from '@/utils';

import styles from './CategoryItem.module.scss';

type Props = {
    category: TranslatedCategory;
    localeCode: Locale.Code;
    /**
     * Listed under its parent category, indented.
     */
    isSubcategory?: boolean;
};

export function CategoryItem({ category, localeCode, isSubcategory }: Props) {
    const { name, description } = category;

    return (
        <DropdownItem
            className={isSubcategory ? styles.subcategory : undefined}
            href={{ routeName: 'category', params: { localeCode, path: categoryPath(category) } }}
        >
            <span className={styles.title}>{name}</span>
            {description && <span className={styles.description}>{description}</span>}
        </DropdownItem>
    );
}
