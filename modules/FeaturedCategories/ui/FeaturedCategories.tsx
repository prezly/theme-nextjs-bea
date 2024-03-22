'use client';

import type { Category, TranslatedCategory } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';

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
                {translatedCategories.map((translatedCategory) => (
                    <FeaturedCategory
                        key={translatedCategory.id}
                        className={styles.item}
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
