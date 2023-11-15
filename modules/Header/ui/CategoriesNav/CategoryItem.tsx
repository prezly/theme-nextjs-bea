import type { TranslatedCategory } from '@prezly/sdk';

import { DropdownItem } from '@/components/Dropdown';

import styles from './CategoryItem.module.scss';

export function CategoryItem({ category }: CategoryItem.Props) {
    return (
        <DropdownItem
            href={{
                routeName: 'category',
                params: { slug: category.slug, localeCode: category.locale },
            }}
            withMobileDisplay
        >
            <span className={styles.title}>{category.name}</span>
            {category.description && (
                <span className={styles.description}>{category.description}</span>
            )}
        </DropdownItem>
    );
}

export namespace CategoryItem {
    export interface Props {
        category: TranslatedCategory;
    }
}
