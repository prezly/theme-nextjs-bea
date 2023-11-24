import type { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generateCategoryPageMetadata, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Category as CategoryIndex } from '@/modules/Category';

interface Props {
    params: {
        localeCode: Locale.Code;
        slug: NonNullable<Category.Translation['slug']>;
    };
}

async function resolveCategory({ localeCode, slug }: Props['params']) {
    return (await app().translatedCategory(localeCode, slug)) ?? notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await resolveCategory(params);
    const category = await app().category(id);

    if (!category) notFound();

    return generateCategoryPageMetadata({ category });
}

export default async function CategoryPage({ params }: Props) {
    const translatedCategory = await resolveCategory(params);
    const category = await app().category(translatedCategory.id);

    if (!category) notFound();

    return (
        <>
            <BroadcastCategoryTranslations category={category} />
            <CategoryIndex category={translatedCategory} pageSize={DEFAULT_PAGE_SIZE} />
        </>
    );
}

async function BroadcastCategoryTranslations(props: { category: Category }) {
    const { generateUrl } = await routing();

    const translations = Object.values(props.category.i18n).map(({ slug, locale }) => ({
        code: locale.code,
        href: slug ? generateUrl('category', { slug, localeCode: locale.code }) : undefined,
    }));

    return <BroadcastTranslations translations={translations} />;
}
