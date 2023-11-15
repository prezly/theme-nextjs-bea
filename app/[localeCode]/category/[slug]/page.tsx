import type { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import { isNotUndefined } from '@technically/is-not-undefined';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Category as CategoryIndex } from '@/modules/Category';
import { Header } from '@/modules/Header';
import { Content } from '@/modules/Layout';
import { api, app, generatePageMetadata, routing } from '@/theme/server';

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
