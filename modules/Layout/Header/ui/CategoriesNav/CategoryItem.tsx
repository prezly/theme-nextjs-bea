import { DropdownItem } from '@/components/Dropdown';

import type { CategoryDisplayProps } from './types';

import styles from './CategoryItem.module.scss';

export function CategoryItem({ category }: CategoryItem.Props) {
    return (
        <DropdownItem href={category.href} withMobileDisplay>
            <span className={styles.title}>{category.name}</span>
            {category.description && (
                <span className={styles.description}>{category.description}</span>
            )}
        </DropdownItem>
    );
}

export namespace CategoryItem {
    export interface Props {
        category: CategoryDisplayProps;
    }
}
