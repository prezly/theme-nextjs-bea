import { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { app, generateCategoryPageMetadata, routing, getSearchSettings } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { parsePreviewSearchParams } from '@/utils';
import { HelpCenterLayout, StoryList } from '@/components/HelpCenter';

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
    const { localeCode, category, translatedCategory } = await resolve(props.params);
    const newsroom = await app().newsroom();
    const language = await app().languageOrDefault(localeCode);
    const themeSettings = await app().themeSettings();
    const searchSettings = getSearchSettings();
    const settings = parsePreviewSearchParams(searchParams, themeSettings);

    // Get all categories for sidebar
    const categories = await app().categories();
    const translatedCategories = await app().translatedCategories(
        localeCode,
        categories.filter((cat) => cat.i18n[localeCode]?.public_stories_number > 0),
    );

    // Get stories for this category
    const { stories } = await app().stories({
        categories: [{ id: category.id }],
        limit: 50,
        locale: { code: localeCode },
    });

    // Fetch stories for each featured category to show in sidebar
    const featuredCategories = categories.filter((category) => category.is_featured);
    const categoryStories: Record<number, any[]> = {};

    for (const featuredCategory of featuredCategories) {
        const { stories: featuredStories } = await app().stories({
            categories: [{ id: featuredCategory.id }],
            limit: 8, // Show up to 8 articles per category
            locale: { code: localeCode },
        });
        categoryStories[featuredCategory.id] = featuredStories;
    }

    return (
        <>
            <BroadcastCategoryTranslations category={category} />
            <HelpCenterLayout
                localeCode={localeCode}
                categories={categories}
                translatedCategories={translatedCategories}
                selectedCategorySlug={translatedCategory.slug}
                newsroom={newsroom}
                information={language.company_information}
                searchSettings={searchSettings}
                categoryStories={categoryStories}
                breadcrumbCategories={[translatedCategory]}
                isHomepage={false}
                mainSiteUrl={settings.main_site_url}
                accentColor={settings.accent_color}
            >
                <StoryList
                    localeCode={localeCode}
                    stories={stories}
                    category={translatedCategory}
                    showDate={settings.show_date}
                    showSubtitle={settings.show_subtitle}
                />
            </HelpCenterLayout>
        </>
    );
}

async function BroadcastCategoryTranslations(props: { category: Category }) {
    const { generateUrl } = await routing();

    const translations = Category.translations(props.category)
        .filter(({ public_stories_number }) => public_stories_number > 0)
        .map(({ slug, locale }) => ({
            code: locale,
            href: slug ? generateUrl('category', { slug, localeCode: locale }) : undefined,
        }));

    return <BroadcastTranslations translations={translations} />;
}
