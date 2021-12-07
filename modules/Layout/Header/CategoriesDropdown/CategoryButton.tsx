import type { Category } from '@prezly/sdk';
import React, { FunctionComponent } from 'react';

import Button from '@/components/Button';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { useGetLinkLocaleSlug } from '@/hooks/useGetLinkLocaleSlug';
import { getCategoryUrl, getLocalizedCategoryData } from '@/utils/prezly';

import styles from './CategoryItem.module.scss';

type Props = {
    category: Category;
    navigationButtonClassName?: string;
};

const CategoryButton: FunctionComponent<Props> = ({ category, navigationButtonClassName }) => {
    const currentLocale = useCurrentLocale();
    const { name, description } = getLocalizedCategoryData(category, currentLocale);
    const getLinkLocaleSlug = useGetLinkLocaleSlug();

    return (
        <Button.Link
            variation="navigation"
            href={getCategoryUrl(category, currentLocale)}
            localeCode={getLinkLocaleSlug()}
            className={navigationButtonClassName}
        >
            <span className={styles.title}>{name}</span>
            {description && <span className={styles.description}>{description}</span>}
        </Button.Link>
    );
};

export default CategoryButton;
