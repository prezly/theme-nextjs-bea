import type { Category } from '@prezly/sdk';
import translations from '@prezly/themes-intl-messages';
import { Button, CategoryLink } from '@prezly/themes-ui-components';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './MainPanel.module.scss';

const INITIAL_ITEMS_SHOWN = 5;

type Props = {
    filteredCategories: Category[];
};

function CategoriesList({ filteredCategories }: Props) {
    const [showAllCategories, setShowAllCategories] = useState(false);

    const displayedCategories = useMemo(
        () =>
            showAllCategories
                ? filteredCategories
                : filteredCategories.slice(0, INITIAL_ITEMS_SHOWN),
        [filteredCategories, showAllCategories],
    );

    function toggleCategories() {
        return setShowAllCategories((s) => !s);
    }

    return (
        <>
            <p className={styles.title}>
                <FormattedMessage {...translations.categories.title} />
            </p>

            <ul className={styles.list}>
                {displayedCategories.map((category) => (
                    <li key={category.id} className={styles.listItem}>
                        <CategoryLink category={category} />
                    </li>
                ))}
            </ul>

            {filteredCategories.length > INITIAL_ITEMS_SHOWN && (
                <Button onClick={toggleCategories} variation="navigation" className={styles.link}>
                    {showAllCategories ? (
                        <FormattedMessage {...translations.search.viewLess} />
                    ) : (
                        <FormattedMessage {...translations.search.viewMore} />
                    )}
                </Button>
            )}
        </>
    );
}

export default CategoriesList;
