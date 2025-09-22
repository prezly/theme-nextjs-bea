import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { app, generatePageMetadata, routing, getSearchSettings } from '@/adapters/server';
import { parsePreviewSearchParams } from '@/utils';
import { HelpCenterLayout } from '@/components/HelpCenter';
import { Story } from '@/modules/Story';
import type { ListStory } from '@/types';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
    }>;
    searchParams: Promise<{
        category?: string;
    }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { generateAbsoluteUrl } = await routing();

    return generatePageMetadata(
        {
            locale: params.localeCode,
            generateUrl: (locale) => generateAbsoluteUrl('index', { localeCode: locale }),
        },
        {
            alternates: {
                types: {
                    [`application/rss+xml`]: generateAbsoluteUrl('feed'),
                },
            },
        },
    );
}


export default async function StoriesIndexPage(props: Props) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    
        try {
            const newsroom = await app().newsroom();
            const language = await app().languageOrDefault(params.localeCode);
        const settings = await app().themeSettings();
        const searchSettings = getSearchSettings();
        const themeSettings = parsePreviewSearchParams(searchParams, settings);
        

        // Get categories for sidebar
        const categories = await app().categories();
        const translatedCategories = await app().translatedCategories(
            params.localeCode,
            categories.filter((category) => category.i18n[params.localeCode]?.public_stories_number > 0),
        );

        // Get pinned story for homepage content (Prezly returns pinned stories first)
        const { stories: pinnedOrMostRecentStories } = await app().stories({
            limit: 1,
            locale: { code: params.localeCode },
        });

        // The first story returned is either pinned or most recent
        let pinnedStory: any = pinnedOrMostRecentStories[0];
        
        // If we have a story, fetch its full content
        if (pinnedStory) {
            pinnedStory = await app().story({ uuid: pinnedStory.uuid });
        }

        // Fetch stories for each featured category to show in sidebar
        const featuredCategories = categories.filter(category => category.is_featured);
        const categoryStories: Record<number, ListStory[]> = {};
        
        for (const category of featuredCategories) {
            const { stories } = await app().stories({
                categories: [{ id: category.id }],
                limit: 8, // Show up to 8 articles per category
                locale: { code: params.localeCode },
            });
            categoryStories[category.id] = stories;
        }

        return (
            <HelpCenterLayout
                localeCode={params.localeCode}
                categories={categories}
                translatedCategories={translatedCategories}
                showTableOfContents={!!pinnedStory?.content}
                content={pinnedStory?.content}
                newsroom={newsroom}
                information={language.company_information}
                searchSettings={searchSettings}
                categoryStories={categoryStories}
                isHomepage={true}
                mainSiteUrl={themeSettings.main_site_url}
                accentColor={themeSettings.accent_color}
            >
                {pinnedStory && pinnedStory.content ? (
                    // Render the pinned story as homepage content with Aria-Docs styling
                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <Story
                            story={pinnedStory}
                            showDate={themeSettings.show_date}
                            withHeaderImage={themeSettings.header_image_placement}
                            relatedStories={[]}
                            actions={{
                                show_copy_content: false,
                                show_copy_url: false,
                                show_download_assets: false,
                                show_download_pdf: false,
                            }}
                            sharingOptions={{
                                sharing_placement: ['bottom'],
                                sharing_actions: [],
                            }}
                            withBadges={false}
                            locale={params.localeCode}
                        />
                    </article>
                ) : (
                    // Fallback if no pinned story - Aria-Docs style
                    <div className="max-w-3xl space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                                Help Center
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Find answers to your questions and learn how to get the most out of our platform.
                            </p>
                        </div>
                        
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Pin a story to display custom homepage content
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>Pin a story in your Prezly newsroom to display it as your help center homepage content.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </HelpCenterLayout>
        );
    } catch (error) {
        // Fallback to mock data if Prezly API is not available
        const { mockCategories, mockTranslatedCategories, mockStories } = await import('@/components/HelpCenter/MockData');
        
        // Use the first mock story as the "pinned" homepage content
        const pinnedMockStory = mockStories[0];
        
        return (
            <HelpCenterLayout
                localeCode={params.localeCode}
                categories={mockCategories}
                translatedCategories={mockTranslatedCategories}
            >
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-amber-800">Demo Mode</h3>
                            <div className="mt-1 text-sm text-amber-700">
                                <p>Using mock data. Configure your Prezly API keys to connect to real content.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Render mock pinned story as homepage content */}
                <article className="prose prose-gray max-w-none">
                    <Story
                        story={pinnedMockStory as any}
                        showDate={true}
                        withHeaderImage="below"
                        relatedStories={[]}
                        actions={{
                            show_copy_content: false,
                            show_copy_url: false,
                            show_download_assets: false,
                            show_download_pdf: false,
                        }}
                        sharingOptions={{
                            sharing_placement: ['bottom'],
                            sharing_actions: [],
                        }}
                        withBadges={false}
                        locale={params.localeCode}
                    />
                </article>
            </HelpCenterLayout>
        );
    }
}
