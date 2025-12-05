import { DEFAULT_PAGE_SIZE, type Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { app, generatePageMetadata, routing } from '@/adapters/server';
import { Contacts } from '@/modules/Contacts';
import { FeaturedCategories } from '@/modules/FeaturedCategories';
import { getStoryListPageSize, parseId, parsePreviewSearchParams } from '@/utils';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
    }>;
    searchParams: Promise<{
        category?: string;
        preview?: string;
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
                    'application/rss+xml': generateAbsoluteUrl('feed'),
                },
            },
        },
    );
}

const Stories = dynamic(
    async () => {
        const component = await import('@/modules/Stories');
        return { default: component.Stories };
    },
    { ssr: true },
);

const HubStories = dynamic(
    async () => {
        const component = await import('@/modules/HubStories');
        return { default: component.HubStories };
    },
    { ssr: true },
);

export default async function StoriesIndexPage(props: Props) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const newsroom = await app().newsroom();
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    return (
        <>
            {newsroom.is_hub ? (
                <HubStories
                    layout={themeSettings.layout}
                    localeCode={params.localeCode}
                    pageSize={DEFAULT_PAGE_SIZE}
                    showDate={themeSettings.show_date}
                    showSubtitle={themeSettings.show_subtitle}
                    storyCardVariant={themeSettings.story_card_variant}
                />
            ) : (
                <Stories
                    categoryId={parseId(searchParams.category)}
                    fullWidthFeaturedStory={themeSettings.full_width_featured_story}
                    layout={themeSettings.layout}
                    localeCode={params.localeCode}
                    pageSize={getStoryListPageSize(themeSettings.layout)}
                    showDate={themeSettings.show_date}
                    showSubtitle={themeSettings.show_subtitle}
                    storyCardVariant={themeSettings.story_card_variant}
                />
            )}
            <Contacts localeCode={params.localeCode} />
            {themeSettings.show_featured_categories && (
                <FeaturedCategories
                    accentColor={themeSettings.accent_color}
                    localeCode={params.localeCode}
                />
            )}
        </>
    );
}
