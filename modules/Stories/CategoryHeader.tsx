import { Category } from '@prezly/sdk';
import type { FunctionComponent } from 'react';

import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { getLocalizedCategoryData } from '@/utils/prezly';

import styles from './CategoryHeader.module.scss';

type Props = {
    category: Category;
};

const CategoryHeader: FunctionComponent<Props> = ({ category }) => {
    const currentLocale = useCurrentLocale();
    const { name, description } = getLocalizedCategoryData(category, currentLocale);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{name}</h1>
            {description && <p className={styles.description}>{description}</p>}
        </div>
    );
};

export default CategoryHeader;
