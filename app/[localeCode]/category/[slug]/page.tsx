import type { Category } from '@prezly/sdk';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import { isNotUndefined } from '@technically/is-not-undefined';
import { notFound } from 'next/navigation';

import { Category as CategoryIndex } from '@/modules/Category';
import { Content, Header } from '@/modules/Layout';
import { api } from '@/theme/server';
import { displayedCategory, routing } from '@/theme-kit';

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
    const { generateUrl } = await routing();
    const category = await resolveCategory(params);
    const displayCategory = await displayedCategory(category);

    if (!displayCategory) notFound();

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
                <CategoryIndex category={displayCategory} pageSize={DEFAULT_PAGE_SIZE} />
            </Content>
        </>
    );
}
