'use client';

import classNames from 'classnames';
import { useMemo, useState } from 'react';

import type { DisplayedCategory } from '@/theme-kit';

import { CategoryLink } from '../CategoryLink';

import styles from './CategoriesList.module.scss';

type Props = {
    categories: DisplayedCategory[];
    showAllCategories?: boolean;
    isStatic?: boolean;
    className?: string;
};

const MAX_CATEGORIES_CHARACTER_LENGTH = 50;

export function CategoriesList({
    categories,
    showAllCategories = false,
    isStatic,
    className,
}: Props) {
    const [showExtraCategories, setShowExtraCategories] = useState(showAllCategories);

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
            const { name } = categories[lastVisibleCategoryIndex];
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
    }, [categories, showExtraCategories]);

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
