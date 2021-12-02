import { Category } from '@prezly/sdk';
import React, { FunctionComponent } from 'react';

import Button from '@/components/Button';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { getCategoryUrl, getLocalizedCategoryData } from '@/utils/prezly';

import styles from './CategoryItem.module.scss';

type Props = {
    category: Category;
    navigationButtonClassName?: string;
};

const CategoryButton: FunctionComponent<Props> = ({ category, navigationButtonClassName }) => {
    const currentLocale = useCurrentLocale();
    const { name, description } = getLocalizedCategoryData(category, currentLocale);

    return (
        <Button.Link
            variation="navigation"
            href={getCategoryUrl(category, currentLocale)}
            className={navigationButtonClassName}
        >
            <span className={styles.title}>{name}</span>
            {description && <span className={styles.description}>{description}</span>}
        </Button.Link>
    );
};

export default CategoryButton;
