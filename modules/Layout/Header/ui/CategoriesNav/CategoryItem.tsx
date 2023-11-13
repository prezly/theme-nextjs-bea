import { DropdownItem } from '@/components/Dropdown';
import type { TranslatedCategory } from '@/theme-kit/domain';

import styles from './CategoryItem.module.scss';

export function CategoryItem({ category }: CategoryItem.Props) {
    return (
        <DropdownItem
            href={{
                routeName: 'category',
                params: { slug: category.slug, localeCode: category.code },
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
