import { Category } from '@prezly/sdk';
import React, { FunctionComponent } from 'react';

import Dropdown from '@/components/Dropdown';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { getCategoryUrl } from '@/utils/prezly';

import styles from './CategoryItem.module.scss';

type Props = {
    category: Category;
};

const CategoryItem: FunctionComponent<Props> = ({ category }) => {
    const currentLocale = useCurrentLocale();

    return (
        <Dropdown.Item href={getCategoryUrl(category, currentLocale)}>
            <span className={styles.title}>{category.display_name}</span>
            {category.display_description && (
                <span className={styles.description}>{category.display_description}</span>
            )}
        </Dropdown.Item>
    );
};

export default CategoryItem;
