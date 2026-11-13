import type { Category as CategoryType, TranslatedCategory } from '@prezly/sdk';

import { app, routing } from '@/adapters/server';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageTitle } from '@/components/PageTitle';
import { JsonLd } from '@/modules/Head';
import type { ThemeSettings } from '@/theme-settings';
import {
    buildBreadcrumbListSchema,
    categoryPath,
    getCategoryAncestors,
    getSubcategories,
    sanitizeNewsrooms,
    sanitizeStories,
} from '@/utils';

import { InfiniteStories } from '../InfiniteStories';

import { Subcategories } from './ui/Subcategories';

interface Props {
    category: CategoryType;
    layout: ThemeSettings['layout'];
    pageSize: number;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
    translatedCategory: TranslatedCategory;
}

export async function Category({
    category,
    layout,
    pageSize,
    showDate,
    showSubtitle,
    storyCardVariant,
    translatedCategory,
}: Props) {
    const localeCode = translatedCategory.locale;

    // The page of a category also shows the stories of the categories below it.
    const { stories, pagination } = await app().stories({
        limit: pageSize,
        query: { 'category.subtree.id': { $any: [category.id] } },
        locale: { code: localeCode },
    });

    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(localeCode);
    const newsroomName = languageSettings.company_information.name || newsroom.name;

    // Only categories with public stories in this language are shown, as in the menu.
    const categories = await app().categories();
    const shownCategories = await app().translatedCategories(
        localeCode,
        categories.filter((item) => item.i18n[localeCode]?.public_stories_number > 0),
    );
    const ancestors = getCategoryAncestors(categories, shownCategories, category.id);
    const subcategories = getSubcategories(categories, shownCategories, category.id);

    const { generateAbsoluteUrl } = await routing();
    const categoryUrl = (item: TranslatedCategory) =>
        generateAbsoluteUrl('category', { localeCode, path: categoryPath(item) });

    return (
        <>
            {/* A top-level category needs no breadcrumbs: it is one step from the homepage. */}
            {ancestors.length > 0 && (
                <>
                    <Breadcrumbs
                        label={newsroomName}
                        items={[
                            {
                                key: 'index',
                                name: newsroomName,
                                href: { routeName: 'index', params: { localeCode } },
                            },
                            ...ancestors.map((ancestor) => ({
                                key: ancestor.id,
                                name: ancestor.name,
                                href: {
                                    routeName: 'category' as const,
                                    params: { localeCode, path: categoryPath(ancestor) },
                                },
                            })),
                            { key: translatedCategory.id, name: translatedCategory.name },
                        ]}
                    />
                    <JsonLd
                        schema={buildBreadcrumbListSchema([
                            {
                                name: newsroomName,
                                url: generateAbsoluteUrl('index', { localeCode }),
                            },
                            ...[...ancestors, translatedCategory].map((item) => ({
                                name: item.name,
                                url: categoryUrl(item),
                            })),
                        ])}
                    />
                </>
            )}
            <PageTitle title={translatedCategory.name} subtitle={translatedCategory.description} />
            <Subcategories categories={subcategories} label={translatedCategory.name} />
            <InfiniteStories
                category={category}
                initialStories={sanitizeStories(stories)}
                isCategoryList
                layout={layout}
                newsroomName={newsroomName}
                newsrooms={sanitizeNewsrooms([newsroom])}
                newsroomUuid={newsroom.uuid}
                pageSize={pageSize}
                showDate={showDate}
                showSubtitle={showSubtitle}
                storyCardVariant={storyCardVariant}
                total={pagination.matched_records_number}
            />
        </>
    );
}
