import { Category } from '@prezly/sdk';
import Link from 'next/link';
import { Fragment, FunctionComponent, useMemo, useState } from 'react';

import { getCategoryUrl } from '@/utils/prezly';

import styles from './StoryCardCategoryList.module.scss';

type Props = {
    categories: Category[];
    showAllCategories?: boolean;
    isStatic?: boolean;
};

const MAX_CATEGORIES_CHARACTER_LENGTH = 20;

const StoryCardCategoryList: FunctionComponent<Props> = ({
    categories,
    showAllCategories = false,
    isStatic,
}) => {
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
            characterCounter += categories[lastVisibleCategoryIndex].display_name.length;

            if (characterCounter < MAX_CATEGORIES_CHARACTER_LENGTH) {
                lastVisibleCategoryIndex += 1;
            }
        }

        return [
            categories.slice(0, lastVisibleCategoryIndex),
            categories.slice(lastVisibleCategoryIndex).length,
        ];
    }, [categories, showExtraCategories]);

    return (
        <>
            {visibleCategories.map((category) => (
                <Fragment key={category.id}>
                    <Link href={getCategoryUrl(category)} passHref>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a className={styles.categoryLink}>
                            <span>{category.display_name}</span>
                        </a>
                    </Link>
                </Fragment>
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

export default StoryCardCategoryList;
