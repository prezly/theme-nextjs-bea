'use client';

import { translations } from '@prezly/theme-kit-intl';
import { useState } from 'react';

import { Link } from '@/components/Link';
import { FormattedMessage } from '@/theme/client';
import type { DisplayedCategory } from '@/theme-kit';
import { Button } from '@/ui';

import ownStyles from './CategoriesList.module.scss';
import mainStyles from './MainPanel.module.scss';

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
            <p className={mainStyles.title}>
                <FormattedMessage for={translations.categories.title} />
            </p>

            <ul className={mainStyles.list}>
                {displayedCategories.map((category) => (
                    <li key={category.id} className={mainStyles.listItem}>
                        <Link className={ownStyles.link} href={category.href}>
                            {category.name}
                        </Link>
                    </li>
                ))}
            </ul>

            {categories.length > INITIAL_ITEMS_SHOWN && (
                <Button
                    onClick={toggleCategories}
                    variation="navigation"
                    className={mainStyles.link}
                >
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
