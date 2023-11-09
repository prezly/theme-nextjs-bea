import type { Category } from '@prezly/sdk';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { Category as CategoryIndex } from '@/modules/Category';
import { Content } from '@/modules/Layout';
import { api, displayedCategory } from '@/theme-kit';

interface Props {
    params: {
        localeCode: Locale.Code;
        slug: NonNullable<Category.Translation['slug']>;
    };
}

async function resolveCategory(params: Props['params']) {
    const { contentDelivery } = api();

    const { localeCode, slug } = params;

    return (await contentDelivery.category(localeCode, slug)) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
    const category = await resolveCategory(params);

    const displayed = await displayedCategory(category);

    return {
        title: displayed?.name ?? category.display_name,
        description: displayed?.description ?? category.display_description,
    };
}

export default async function CategoryPage({ params }: Props) {
    const category = await displayedCategory(await resolveCategory(params));

    if (!category) notFound();

    return (
        <Content>
            <CategoryIndex category={category} pageSize={DEFAULT_PAGE_SIZE} />
        </Content>
    );
}
