'use client';

import type { Category, TranslatedCategory } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { FormattedMessage, useLocale } from '@/adapters/client';

import { FeaturedCategory } from './FeaturedCategory';

import styles from './FeaturedCategories.module.scss';

interface Props {
    categories: Category[];
    translatedCategories: TranslatedCategory[];
}

export function FeaturedCategories({ categories, translatedCategories }: Props) {
    function getCategory(translatedCategory: TranslatedCategory) {
        return categories.find((i) => i.id === translatedCategory.id)!;
    }

    const locale = useLocale();

    return (
        <div className={styles.categories}>
            <h2 className={styles.title}>
                <FormattedMessage locale={locale} for={translations.categories.title} />
            </h2>
            <div className={styles.container}>
                {translatedCategories.map((translatedCategory, i) => (
                    <FeaturedCategory
                        key={translatedCategory.id}
                        className={classNames(
                            styles.item,
                            getColumnWidth(i + 1, translatedCategories.length),
                        )}
                        image={getCategory(translatedCategory).image}
                        name={translatedCategory.name}
                        slug={translatedCategory.slug}
                        locale={locale}
                    />
                ))}
            </div>
        </div>
    );
}

function getColumnWidth(i: number, total: number) {
    if (total <= 1) {
        return styles.oneColumn;
    }

    if (total === 2) {
        return styles.twoColumns;
    }

    if (total % 3 === 0) {
        return styles.threeColumns;
    }

    if (total % 4 === 0) {
        return styles.fourColumns;
    }

    // Only lay out a row of 4 if it can be followed by a row of 3.
    if (total - 4 >= 3) {
        if (i <= 4) {
            return styles.fourColumns;
        }

        return getColumnWidth(i - 4, total - 4);
    }

    if (i <= 3) {
        return styles.threeColumns;
    }

    return getColumnWidth(i - 3, total - 3);
}
