import translations from '@prezly/themes-intl-messages';
import classNames from 'classnames';
import { FunctionComponent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@/components/Button';
import CategoryLink from '@/components/CategoryLink';
import { useCategories } from '@/hooks/useCategories';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { IconSearchCaret } from '@/icons';
import { getCategoryHasTranslation } from '@/utils/prezly';

import styles from './MainPanel.module.scss';

interface Props {}

const INITIAL_ITEMS_SHOWN = 5;

const CategoriesList: FunctionComponent<Props> = () => {
    const currentLocale = useCurrentLocale();
    const categories = useCategories();
    const [showAllCategories, setShowAllCategories] = useState(false);

    const filteredCategories = useMemo(
        () =>
            categories.filter(
                (category) =>
                    category.stories_number > 0 &&
                    getCategoryHasTranslation(category, currentLocale),
            ),
        [categories, currentLocale],
    );

    const displayedCategories = useMemo(
        () =>
            showAllCategories
                ? filteredCategories
                : filteredCategories.slice(0, INITIAL_ITEMS_SHOWN),
        [filteredCategories, showAllCategories],
    );

    const toggleCategories = () => setShowAllCategories((s) => !s);

    return (
        <>
            <p className={styles.title}>
                <FormattedMessage {...translations.categories.title} />
            </p>

            <ul className={styles.list}>
                {displayedCategories.map((category) => (
                    <li key={category.id} className={styles.listItem}>
                        <CategoryLink category={category} className={styles.categoryLink} />
                    </li>
                ))}
            </ul>

            {filteredCategories.length > INITIAL_ITEMS_SHOWN && (
                <Button
                    onClick={toggleCategories}
                    variation="navigation"
                    className={classNames(styles.link, styles.viewMoreCategoriesLink)}
                >
                    {showAllCategories ? 'View less' : 'View more'}
                    <IconSearchCaret
                        className={classNames(styles.caret, {
                            [styles.caretOpen]: showAllCategories,
                        })}
                    />
                </Button>
            )}
        </>
    );
};

export default CategoriesList;
