import type { Category } from '@prezly/sdk';
import {
    getCategoryUrl,
    getLocalizedCategoryData,
    useCurrentLocale,
    useGetLinkLocaleSlug,
} from '@prezly/theme-kit-nextjs';

import { ButtonLink } from '@/ui';

import styles from './CategoryItem.module.scss';

type Props = {
    category: Category;
    navigationButtonClassName?: string;
};

function CategoryButton({ category, navigationButtonClassName }: Props) {
    const currentLocale = useCurrentLocale();
    const { name, description } = getLocalizedCategoryData(category, currentLocale);
    const getLinkLocaleSlug = useGetLinkLocaleSlug();

    return (
        <ButtonLink
            variation="navigation"
            href={getCategoryUrl(category, currentLocale)}
            localeCode={getLinkLocaleSlug()}
            className={navigationButtonClassName}
        >
            <span className={styles.title}>{name}</span>
            {description && <span className={styles.description}>{description}</span>}
        </ButtonLink>
    );
}

export default CategoryButton;
