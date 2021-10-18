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
    showAllCategories,
    isStatic,
}) => {
    const [visibleCategories, hiddenCategories] = useMemo(() => {
        if (showAllCategories) {
            return [categories, []];
        }

        let characterCounter = 0;
        let lastVisibleCategoryIndex = 0;

        while (
            characterCounter < MAX_CATEGORIES_CHARACTER_LENGTH &&
            lastVisibleCategoryIndex < categories.length
        ) {
            characterCounter += categories[lastVisibleCategoryIndex].display_name.length;
            lastVisibleCategoryIndex += 1;
        }

        if (characterCounter > MAX_CATEGORIES_CHARACTER_LENGTH) {
            lastVisibleCategoryIndex -= 1;
        }

        return [
            categories.slice(0, lastVisibleCategoryIndex),
            categories.slice(lastVisibleCategoryIndex),
        ];
    }, [categories, showAllCategories]);

    const [showExtraCategories, setShowExtraCategories] = useState(false);

    return (
        <>
            {visibleCategories.map((category, index) => (
                <Fragment key={category.id}>
                    <Link href={getCategoryUrl(category)} passHref>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a className={styles.categoryLink}>{category.display_name}</a>
                    </Link>
                    {index !== visibleCategories.length - 1 && (
                        <span className={styles.categorySeparator}>,</span>
                    )}
                </Fragment>
            ))}
            {hiddenCategories.length > 0 &&
                (showExtraCategories ? (
                    hiddenCategories.map((category, index) => (
                        <Fragment key={category.id}>
                            {index === 0 && <span className={styles.categorySeparator}>,</span>}
                            <Link href={getCategoryUrl(category)} passHref>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a className={styles.categoryLink}>{category.display_name}</a>
                            </Link>
                            {index !== hiddenCategories.length - 1 && (
                                <span className={styles.categorySeparator}>,</span>
                            )}
                        </Fragment>
                    ))
                ) : (
                    <>
                        <span className={styles.categorySeparator}>,</span>
                        {isStatic ? (
                            <span className={styles.category}>+{hiddenCategories.length}</span>
                        ) : (
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                            <span
                                className={styles.categoryLink}
                                onClick={() => setShowExtraCategories(true)}
                                role="button"
                                tabIndex={0}
                            >
                                +{hiddenCategories.length}
                            </span>
                        )}
                    </>
                ))}
        </>
    );
};

export default StoryCardCategoryList;
