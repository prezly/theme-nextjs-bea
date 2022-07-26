import type { Category } from '@prezly/sdk';
import type { AlgoliaCategoryRef } from '@prezly/theme-kit-nextjs';
import { getLocalizedCategoryData, useCurrentLocale } from '@prezly/theme-kit-nextjs';
import { CategoryLink } from '@prezly/themes-ui-components';
import classNames from 'classnames';
import { useMemo, useState } from 'react';

import styles from './CategoriesList.module.scss';

type Props = {
    categories: Category[] | AlgoliaCategoryRef[];
    showAllCategories?: boolean;
    isStatic?: boolean;
    className?: string;
};

const MAX_CATEGORIES_CHARACTER_LENGTH = 50;

function CategoriesList({ categories, showAllCategories = false, isStatic, className }: Props) {
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

            if (
                characterCounter < MAX_CATEGORIES_CHARACTER_LENGTH ||
                lastVisibleCategoryIndex === 0
            ) {
                lastVisibleCategoryIndex += 1;
            }
        }

        return [
            categories.slice(0, lastVisibleCategoryIndex),
            categories.slice(lastVisibleCategoryIndex).length,
        ];
    }, [categories, showExtraCategories, currentLocale]);

    return (
        <div className={classNames(styles.categoriesList, className)}>
            {visibleCategories.map((category) => (
                <CategoryLink
                    key={category.id}
                    category={category}
                    className={styles.categoryLink}
                />
            ))}
            {hiddenCategoriesCount > 0 &&
                (isStatic ? (
                    <span className={styles.moreCategories}>+{hiddenCategoriesCount}</span>
                ) : (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <span
                        className={classNames(styles.moreCategories, styles.moreCategoriesLink)}
                        onClick={() => setShowExtraCategories(true)}
                        role="button"
                        tabIndex={0}
                    >
                        <span>+{hiddenCategoriesCount}</span>
                    </span>
                ))}
        </div>
    );
}

export default CategoriesList;
