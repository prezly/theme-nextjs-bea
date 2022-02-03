import type { Category } from '@prezly/sdk';
import {
    getCategoryUrl,
    getLocalizedCategoryData,
    useCurrentLocale,
} from '@prezly/theme-kit-nextjs';

import { Dropdown } from '@/components';

import styles from './CategoryItem.module.scss';

type Props = {
    category: Category;
};

function CategoryItem({ category }: Props) {
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
}

export default CategoryItem;
