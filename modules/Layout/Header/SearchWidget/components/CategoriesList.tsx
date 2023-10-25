import type { Category } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-intl';
import { useMemo, useState } from 'react';

import { CategoryLink } from '@/components';
import { FormattedMessage } from '@/theme-kit';
import { Button } from '@/ui';

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
                <FormattedMessage from={translations.categories.title} />
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
                        <FormattedMessage from={translations.search.viewLess} />
                    ) : (
                        <FormattedMessage from={translations.search.viewMore} />
                    )}
                </Button>
            )}
        </>
    );
}

export default CategoriesList;
