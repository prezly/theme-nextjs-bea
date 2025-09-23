import type { Locale } from '@prezly/theme-kit-nextjs';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata, getSearchSettings } from '@/adapters/server';
import { Story } from '@/modules/Story';
import { parsePreviewSearchParams } from '@/utils';
import { HelpCenterLayout } from '@/components/HelpCenter';

import { Broadcast } from '../components';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
        slug: string;
    }>;
    searchParams: Promise<Record<string, string>>;
}

async function resolve(params: Props['params']) {
    const { localeCode, slug } = await params;

    const story = await app().story({ slug });
    if (!story) notFound();

    const { stories: relatedStories } = await app().stories({
        limit: 3,
        locale: localeCode,
        query: JSON.stringify({ slug: { $ne: slug } }),
    });

    return { relatedStories, story };
}

export async function generateMetadata({ params }: Props) {
    const { story } = await resolve(params);

    return generateStoryPageMetadata({ story });
}

export default async function StoryPage(props: Props) {
    const { localeCode } = await props.params;
    const searchParams = await props.searchParams;
    const { story, relatedStories } = await resolve(props.params);
    const newsroom = await app().newsroom();
    const language = await app().languageOrDefault(localeCode);
    const settings = await app().themeSettings();
    const searchSettings = getSearchSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    // Get story categories for breadcrumbs
    const storyCategories = await app().translatedCategories(story.culture.code, story.categories);

    // Get categories for sidebar
    const categories = await app().categories();
    const translatedCategories = await app().translatedCategories(
        localeCode,
        categories.filter((category) => category.i18n[localeCode]?.public_stories_number > 0),
    );

    // Fetch stories for each featured category to show in sidebar
    const featuredCategories = categories.filter((category) => category.is_featured);
    const categoryStories: Record<number, any[]> = {};

    for (const category of featuredCategories) {
        const { stories } = await app().stories({
            categories: [{ id: category.id }],
            limit: 8, // Show up to 8 articles per category
            locale: { code: localeCode },
        });
        categoryStories[category.id] = stories;
    }

    return (
        <>
            <Broadcast story={story} />
            <HelpCenterLayout
                localeCode={localeCode}
                categories={categories}
                translatedCategories={translatedCategories}
                showTableOfContents={true}
                content={story.content}
                newsroom={newsroom}
                information={language.company_information}
                searchSettings={searchSettings}
                categoryStories={categoryStories}
                breadcrumbCategories={storyCategories}
                storyTitle={story.title}
                isHomepage={false}
                mainSiteUrl={themeSettings.main_site_url}
                accentColor={themeSettings.accent_color}
                currentStorySlug={story.slug}
            >
                <Story
                    story={story}
                    showDate={themeSettings.show_date}
                    withHeaderImage={themeSettings.header_image_placement}
                    relatedStories={themeSettings.show_read_more ? relatedStories : []}
                    actions={{
                        show_copy_content: themeSettings.show_copy_content,
                        show_copy_url: themeSettings.show_copy_url,
                        show_download_assets: themeSettings.show_download_assets,
                        show_download_pdf: themeSettings.show_download_pdf,
                    }}
                    sharingOptions={{
                        sharing_placement: themeSettings.sharing_placement,
                        sharing_actions: themeSettings.sharing_actions,
                    }}
                    withBadges={themeSettings.story_card_variant === 'boxed'}
                    locale={localeCode}
                />
            </HelpCenterLayout>
        </>
    );
}
