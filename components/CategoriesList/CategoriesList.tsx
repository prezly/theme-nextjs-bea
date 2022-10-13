import type { Category } from '@prezly/sdk';
import type { AlgoliaCategoryRef } from '@prezly/theme-kit-nextjs';
import { getLocalizedCategoryData, useCurrentLocale } from '@prezly/theme-kit-nextjs';
import { CategoryLink } from '@prezly/themes-ui-components';
import classNames from 'clsx';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import styles from './CategoriesList.module.scss';

type Props = {
    categories: Category[] | AlgoliaCategoryRef[];
    showAllCategories?: boolean;
    isStatic?: boolean;
};

const MAX_CATEGORIES_CHARACTER_LENGTH = 20;

function CategoriesList({ categories, showAllCategories = false, isStatic }: Props) {
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
        <>
            {visibleCategories.map((category) => (
                <Link
                    href={`/category/${'i18n' in category ? category.i18n.en.slug : ''}`}
                    locale={false}
                    passHref
                    key={category.id}
                >
                    <a className={classNames('text-xs font-medium text-rose-500 align-middle')}>
                        {'display_name' in category ? category.display_name : ''}
                    </a>
                </Link>
                // <CategoryLink
                //     key={category.id}
                //     category={category}
                //     className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100"
                // />
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
        </>
    );
}

export default CategoriesList;
