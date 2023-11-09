'use client';

import type { Category } from '@prezly/sdk';
import { getCategoryHasTranslation, getLocalizedCategoryData } from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';

import { useIntl } from '@/theme-kit/intl/client';
import { useRouting } from '@/theme-kit/useRouting';

import type { DisplayedCategory } from './types';

export * from './types';

export function useDisplayedCategories(categories: Category[]): DisplayedCategory[] {
    const { locale: localeCode } = useIntl();
    const { generateUrl } = useRouting();

    return categories
        .filter((category) => getCategoryHasTranslation(category, localeCode))
        .map((category) => {
            const { id } = category;
            const { name, description, slug } = getLocalizedCategoryData(category, localeCode);

            if (!slug) return undefined;

            const href = generateUrl('category', { slug, localeCode });

            return { id, href, name, description };
        })
        .filter(isNotUndefined);
}
