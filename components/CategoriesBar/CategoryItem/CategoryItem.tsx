import type { TranslatedCategory } from '@prezly/sdk';

import { DropdownItem } from '@/components/Dropdown';

import styles from './CategoryItem.module.scss';

type Props = {
    category: TranslatedCategory;
};

export function CategoryItem({ category }: Props) {
    const { name, description } = category;

    return (
        <DropdownItem href={{ routeName: 'category', params: { slug: category.slug } }}>
            <span className={styles.title}>{name}</span>
            {description && <span className={styles.description}>{description}</span>}
        </DropdownItem>
    );
}
