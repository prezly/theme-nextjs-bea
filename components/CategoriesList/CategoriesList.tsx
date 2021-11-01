import { Category } from '@prezly/sdk';
import { FunctionComponent, useMemo, useState } from 'react';

import CategoryLink from '@/components/CategoryLink';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { getLocalizedCategoryData } from '@/utils/prezly';

import styles from './CategoriesList.module.scss';

type Props = {
    categories: Category[];
    showAllCategories?: boolean;
    isStatic?: boolean;
};

const MAX_CATEGORIES_CHARACTER_LENGTH = 20;

const CategoriesList: FunctionComponent<Props> = ({
    categories,
    showAllCategories = false,
    isStatic,
}) => {
    const [showExtraCategories, setShowExtraCategories] = useState(showAllCategories);
    const currentLocale = useCurrentLocale();

    const [visibleCategories, hiddenCategoriesCount] = useMemo(() => {
        if (showExtraCategories) {
            return [categories, 0];
        }

        let characterCounter = 0;
        let lastVisibleCategoryIndex = 0;

        while (
            characterCounter < MAX_CATEGORIES_CHARACTER_LENGTH &&
            lastVisibleCategoryIndex < categories.length
        ) {
            const { name } = getLocalizedCategoryData(
                categories[lastVisibleCategoryIndex],
                currentLocale,
            );
            characterCounter += name.length;

            if (characterCounter < MAX_CATEGORIES_CHARACTER_LENGTH) {
                lastVisibleCategoryIndex += 1;
            }
        }

        return [
            categories.slice(0, lastVisibleCategoryIndex),
            categories.slice(lastVisibleCategoryIndex).length,
        ];
    }, [categories, showExtraCategories, currentLocale]);

    return (
        <>
            {visibleCategories.map((category) => (
                <CategoryLink key={category.id} category={category} />
            ))}
            {hiddenCategoriesCount > 0 &&
                (isStatic ? (
                    <span className={styles.category}>+{hiddenCategoriesCount}</span>
                ) : (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <span
                        className={styles.categoryLink}
                        onClick={() => setShowExtraCategories(true)}
                        role="button"
                        tabIndex={0}
                    >
                        <span>+{hiddenCategoriesCount}</span>
                    </span>
                ))}
        </>
    );
};

export default CategoriesList;
