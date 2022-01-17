import type { Category } from '@prezly/sdk';
import React, { FunctionComponent } from 'react';

import { Dropdown } from '@/components';
import { useCurrentLocale } from '@/hooks';
import { getCategoryUrl, getLocalizedCategoryData } from '@/utils/prezly';

import styles from './CategoryItem.module.scss';

type Props = {
    category: Category;
};

const CategoryItem: FunctionComponent<Props> = ({ category }) => {
    const currentLocale = useCurrentLocale();
    const { name, description } = getLocalizedCategoryData(category, currentLocale);

    return (
        <Dropdown.Item
            href={getCategoryUrl(category, currentLocale)}
            localeCode={currentLocale.toUnderscoreCode()}
            withMobileDisplay
        >
            <span className={styles.title}>{name}</span>
            {description && <span className={styles.description}>{description}</span>}
        </Dropdown.Item>
    );
};

export default CategoryItem;
