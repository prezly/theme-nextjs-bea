import type { Category } from '@prezly/sdk';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import { isNotUndefined } from '@technically/is-not-undefined';
import { notFound } from 'next/navigation';

import { Category as CategoryIndex } from '@/modules/Category';
import { Content, Header } from '@/modules/Layout';
import { api, routing } from '@/theme/server';

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

export async function generateMetadata({ params }: Props) {
    const category = await resolveCategory(params);

    return {
        title: category.name,
        description: category.description,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { contentDelivery } = api();
    const { generateUrl } = await routing();

    const translatedCategory = await resolveCategory(params);
    const category = await contentDelivery.category(translatedCategory.id);

    if (!category) notFound();

    const languageVersions = Object.values(category.i18n)
        .filter(isNotUndefined)
        .map(({ slug, locale }) => ({
            code: locale.code,
            href: slug ? generateUrl('category', { slug, localeCode: locale.code }) : undefined,
        }));

    return (
        <>
            <Header languages={languageVersions} />
            <Content>
                <CategoryIndex category={translatedCategory} pageSize={DEFAULT_PAGE_SIZE} />
            </Content>
        </>
    );
}
