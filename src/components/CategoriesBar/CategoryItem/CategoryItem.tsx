import type { TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { DropdownItem } from '@/components/Dropdown';

import styles from './CategoryItem.module.scss';

type Props = {
    category: TranslatedCategory;
    localeCode: Locale.Code;
};

export function CategoryItem({ category, localeCode }: Props) {
    const { name, description, slug } = category;

    return (
        <DropdownItem href={{ routeName: 'category', params: { localeCode, slug } }}>
            <span className={styles.title}>{name}</span>
            {description && <span className={styles.description}>{description}</span>}
        </DropdownItem>
    );
}
