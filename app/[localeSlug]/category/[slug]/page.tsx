import { Category } from '@prezly/sdk';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generateCategoryPageMetadata, handleLocaleSlug, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Category as CategoryIndex } from '@/modules/Category';

interface Props {
    params: {
        localeSlug: string;
        slug: NonNullable<Category.Translation['slug']>;
    };
}

async function resolve({ localeSlug, slug }: Props['params']) {
    const { generateUrl } = await routing();
    const localeCode = await handleLocaleSlug(localeSlug, (localeCode) =>
        generateUrl('category', { slug, localeCode }),
    );

    const translatedCategory = await app().translatedCategory(localeCode, slug);
    if (!translatedCategory) notFound();

    const category = await app().category(translatedCategory.id);
    if (!category) notFound();

    return { localeCode, category, translatedCategory };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { localeCode, category } = await resolve(params);

    return generateCategoryPageMetadata({ locale: localeCode, category });
}

export default async function CategoryPage({ params }: Props) {
    const { category, translatedCategory } = await resolve(params);

    return (
        <>
            <BroadcastCategoryTranslations category={category} />
            <CategoryIndex category={translatedCategory} pageSize={DEFAULT_PAGE_SIZE} />
        </>
    );
}

async function BroadcastCategoryTranslations(props: { category: Category }) {
    const { generateUrl } = await routing();

    const translations = Category.translations(props.category).map(({ slug, locale }) => ({
        code: locale,
        href: slug ? generateUrl('category', { slug, localeCode: locale }) : undefined,
    }));

    return <BroadcastTranslations translations={translations} />;
}
