import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { DropdownItem } from '@/components/Dropdown';
import { categoryPath } from '@/utils';

import styles from './CategoryItem.module.scss';

type Props = {
    category: TranslatedCategory;
    localeCode: Locale.Code;
};

export function CategoryItem({ category, localeCode }: Props) {
    const { name, description } = category;

    return (
        <DropdownItem
            href={{ routeName: 'category', params: { localeCode, path: categoryPath(category) } }}
        >
            <span className={styles.title}>{name}</span>
            {description && <span className={styles.description}>{description}</span>}
        </DropdownItem>
    );
}
