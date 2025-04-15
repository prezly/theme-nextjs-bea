import type { TranslatedCategory } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import { useState } from 'react';

import { FormattedMessage, useLocale } from '@/adapters/client';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { onPlainLeftClick } from '@/utils';

import ownStyles from './CategoriesList.module.scss';
import mainStyles from './MainPanel.module.scss';

const INITIAL_ITEMS_SHOWN = 5;

interface Props {
    categories: TranslatedCategory[];
    onClose: () => void;
}

export function CategoriesList({ categories, onClose }: Props) {
    const locale = useLocale();
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
                <FormattedMessage locale={locale} for={translations.categories.title} />
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
                            onClick={onPlainLeftClick(onClose)}
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
                        <FormattedMessage locale={locale} for={translations.search.viewLess} />
                    ) : (
                        <FormattedMessage locale={locale} for={translations.search.viewMore} />
                    )}
                </Button>
            )}
        </>
    );
}
