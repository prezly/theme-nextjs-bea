import { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import { app, generateCategoryPageMetadata, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Category as CategoryIndex } from '@/modules/Category';
import {
    categoryPath,
    categoryPathFromSegments,
    getStoryListPageSize,
    parsePreviewSearchParams,
} from '@/utils';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
        /**
         * The category's address, one item per segment: `/category/cars/models/eqs` gives
         * `['cars', 'models', 'eqs']`.
         */
        path: string[];
    }>;
    searchParams: Promise<Record<string, string>>;
}

async function resolve(params: Props['params']) {
    const { localeCode, path: segments } = await params;
    const path = categoryPathFromSegments(segments);

    const translatedCategory = await app().translatedCategory(localeCode, path);

    if (!translatedCategory) {
        // No category is at this address. One may have been: a category that was moved or got
        // another slug keeps its old addresses, and those redirect to where it is now.
        const moved = await app().movedCategory(localeCode, path);
        if (!moved || moved.public_stories_number === 0) notFound();

        const { generateUrl } = await routing();
        permanentRedirect(generateUrl('category', { localeCode, path: categoryPath(moved) }));
    }

    // A category found by its slug alone (an old one-segment link to a subcategory) has
    // another address. Send the visitor there, so every category has one URL.
    if (categoryPath(translatedCategory) !== path) {
        const { generateUrl } = await routing();
        permanentRedirect(
            generateUrl('category', { localeCode, path: categoryPath(translatedCategory) }),
        );
    }

    if (translatedCategory.public_stories_number === 0) notFound();

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

    const translations = Category.translations(props.category)
        .filter(({ public_stories_number }) => public_stories_number > 0)
        .map((translation) => ({
            code: translation.locale,
            href: translation.slug
                ? generateUrl('category', {
                      path: categoryPath(translation),
                      localeCode: translation.locale,
                  })
                : undefined,
        }));

    return <BroadcastTranslations translations={translations} />;
}
