import 'server-only';

import type { Category } from '@prezly/sdk';
import { getCategoryHasTranslation, getLocalizedCategoryData } from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';

import { api } from '@/theme-kit/api';

import { locale } from '../locale';
import { routing } from '../routing';

import type { DisplayedCategory } from './types';

export * from './types';

async function newsroomCategories(): Promise<Category[]> {
    const { contentDelivery } = api();

    const categories = await contentDelivery.categories();

    return categories.filter((category) => category.public_stories_number > 0);
}

export async function displayedCategories(categories?: Category[]): Promise<DisplayedCategory[]> {
    const { code: localeCode } = locale();
    const { generateUrl } = await routing();

    return (categories ?? (await newsroomCategories()))
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
