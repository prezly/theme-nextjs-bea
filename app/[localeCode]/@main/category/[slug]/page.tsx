import type { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { api, app, generatePageMetadata, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Category as CategoryIndex } from '@/modules/Category';

interface Props {
    params: {
        localeCode: Locale.Code;
        slug: NonNullable<Category.Translation['slug']>;
    };
}

async function resolveCategory(params: Props['params']) {
    const { contentDelivery } = api();

    const { localeCode, slug } = params;

    return (await contentDelivery.translatedCategory(localeCode, slug)) ?? notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id, name, description } = await resolveCategory(params);
    const category = await app().category(id);

    if (!category) notFound();

    const { generateUrl } = await routing();

    return generatePageMetadata({
        title: name,
        description,
        generateUrl: (localeCode) => {
            const i18n = category.i18n[localeCode];
            return i18n && i18n.slug && i18n.name
                ? generateUrl('category', { slug: i18n.slug, localeCode })
                : undefined;
        },
    });
}

export default async function CategoryPage({ params }: Props) {
    const { contentDelivery } = api();

    const translatedCategory = await resolveCategory(params);
    const category = await contentDelivery.category(translatedCategory.id);

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
