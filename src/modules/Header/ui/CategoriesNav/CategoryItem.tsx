import type { TranslatedCategory } from '@prezly/sdk';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import { DropdownItem } from '@/components/Dropdown';

import styles from './CategoryItem.module.scss';
import { categoryPath } from '@/utils';

export function CategoryItem({ category, children, isSubcategory }: CategoryItem.Props) {
    return (
        <DropdownItem
            className={classNames(styles.item, { [styles.subcategory]: isSubcategory })}
            href={{
                routeName: 'category',
                params: { path: categoryPath(category), localeCode: category.locale },
            }}
            withMobileDisplay
        >
            <span className={styles.title}>{children ?? category.name}</span>
        </DropdownItem>
    );
}

export namespace CategoryItem {
    export interface Props {
        category: TranslatedCategory;
        /**
         * Shown in place of the category name.
         */
        children?: ReactNode;
        /**
         * Listed under its parent category, indented.
         */
        isSubcategory?: boolean;
    }
}
