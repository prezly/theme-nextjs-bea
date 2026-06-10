'use client';

import type { TranslatedCategory } from '@prezly/sdk';

import { ButtonLink } from '@/components/Button';

interface Props {
    categories: TranslatedCategory[];
    itemClassName?: string;
    linkClassName?: string;
}

/**
 * Neumann-style categories navigation
 * Shows each category as a direct link in the header (not in a dropdown)
 */
export function NeumannCategoriesNav({ categories, itemClassName, linkClassName }: Props) {
    if (categories.length === 0) {
        return null;
    }

    return (
        <>
            {categories.map((category) => (
                <li key={category.id} className={itemClassName}>
                    <ButtonLink
                        href={{
                            routeName: 'category',
                            params: {
                                slug: category.slug,
                                localeCode: category.locale,
                            },
                        }}
                        variation="navigation"
                        className={linkClassName}
                    >
                        {category.name}
                    </ButtonLink>
                </li>
            ))}
        </>
    );
}
