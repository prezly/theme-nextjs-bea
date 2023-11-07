'use client';

import { translations } from '@prezly/theme-kit-intl';
import { useState } from 'react';

import { Link } from '@/components/Link';
import { FormattedMessage } from '@/theme-kit/intl/client';
import { Button, type DisplayedCategory } from '@/ui';

import styles from './MainPanel.module.scss';

const INITIAL_ITEMS_SHOWN = 5;

interface Props {
    categories: DisplayedCategory[];
}

export function CategoriesList({ categories }: Props) {
    const [showAllCategories, setShowAllCategories] = useState(false);

    const displayedCategories = showAllCategories
        ? categories
        : categories.slice(0, INITIAL_ITEMS_SHOWN);

    function toggleCategories() {
        return setShowAllCategories((s) => !s);
    }

    return (
        <>
            <p className={styles.title}>
                <FormattedMessage for={translations.categories.title} />
            </p>

            <ul className={styles.list}>
                {displayedCategories.map((category) => (
                    <li key={category.id} className={styles.listItem}>
                        <Link href={category.href}>{category.name}</Link>
                    </li>
                ))}
            </ul>

            {categories.length > INITIAL_ITEMS_SHOWN && (
                <Button onClick={toggleCategories} variation="navigation" className={styles.link}>
                    {showAllCategories ? (
                        <FormattedMessage for={translations.search.viewLess} />
                    ) : (
                        <FormattedMessage for={translations.search.viewMore} />
                    )}
                </Button>
            )}
        </>
    );
}
