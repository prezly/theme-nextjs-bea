import type { TranslatedCategory } from '@prezly/sdk';

import { DropdownItem } from '@/components/Dropdown';

import styles from './CategoryItem.module.scss';
import { categoryPath } from '@/utils';

export function CategoryItem({ category }: CategoryItem.Props) {
    return (
        <DropdownItem
            className={styles.item}
            href={{
                routeName: 'category',
                params: { path: categoryPath(category), localeCode: category.locale },
            }}
            withMobileDisplay
        >
            <span className={styles.title}>{category.name}</span>
        </DropdownItem>
    );
}

export namespace CategoryItem {
    export interface Props {
        category: TranslatedCategory;
    }
}
