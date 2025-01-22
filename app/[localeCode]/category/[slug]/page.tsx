import { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generateCategoryPageMetadata, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Category as CategoryIndex } from '@/modules/Category';
import { getStoryListPageSize, parsePreviewSearchParams } from '@/utils';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
        slug: NonNullable<Category.Translation['slug']>;
    }>;
    searchParams: Promise<Record<string, string>>;
}

async function resolve(params: Props['params']) {
    const { localeCode, slug } = await params;
    const translatedCategory = await app().translatedCategory(localeCode, slug);
    if (!translatedCategory || translatedCategory.public_stories_number === 0) notFound();

    const category = await app().category(translatedCategory.id);
    if (!category) notFound();

    return { localeCode, category, translatedCategory };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { localeCode, category } = await resolve(props.params);

    return generateCategoryPageMetadata({ locale: localeCode, category });
}

export default async function CategoryPage(props: Props) {
    const searchParams = await props.searchParams;
    const { category, translatedCategory } = await resolve(props.params);
    const themeSettings = await app().themeSettings();
    const settings = parsePreviewSearchParams(searchParams, themeSettings);

    return (
        <>
            <BroadcastCategoryTranslations category={category} />
            <CategoryIndex
                category={category}
                layout={settings.layout}
                pageSize={getStoryListPageSize(settings.layout)}
                showDate={settings.show_date}
                showSubtitle={settings.show_subtitle}
                storyCardVariant={settings.story_card_variant}
                translatedCategory={translatedCategory}
            />
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
