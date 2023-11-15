'use client';

import type { TranslatedCategory } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import { useState } from 'react';

import { FormattedMessage } from '@/adapters/client';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';

import ownStyles from './CategoriesList.module.scss';
import mainStyles from './MainPanel.module.scss';

const INITIAL_ITEMS_SHOWN = 5;

interface Props {
    categories: TranslatedCategory[];
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
                        <Link
                            className={ownStyles.link}
                            href={{
                                routeName: 'category',
                                params: { slug: category.slug, localeCode: category.locale },
                            }}
                        >
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
