import type { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { notFound } from 'next/navigation';

import { api } from '@/theme-kit';

interface Props {
    params: {
        localeCode: Locale.Code;
        slug: NonNullable<Category.Translation['slug']>;
    };
}

async function resolveCategory(params: Props['params']) {
    const { contentDelivery } = api();

    const { slug } = params;

    // FIXME: pass localeCode
    return (await contentDelivery.category(slug)) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
    const category = await resolveCategory(params);

    // FIXME: Category i18n
    return {
        title: category.display_name,
        description: category.display_description,
    };
}

export default async function CategoryPage({ params }: Props) {
    const category = await resolveCategory(params);

    return (
        <div>
            Category Page for #{category.id} in {params.localeCode}
        </div>
    );
}
