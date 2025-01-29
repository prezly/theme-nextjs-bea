import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { app, generatePageMetadata, routing } from '@/adapters/server';
import { Contacts } from '@/modules/Contacts';
import { FeaturedCategories } from '@/modules/FeaturedCategories';
import { Stories } from '@/modules/Stories';
import { getStoryListPageSize, parseNumber, parsePreviewSearchParams } from '@/utils';

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
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    return (
        <>
            <Stories
                categoryId={searchParams.category ? parseNumber(searchParams.category) : undefined}
                fullWidthFeaturedStory={themeSettings.full_width_featured_story}
                layout={themeSettings.layout}
                localeCode={params.localeCode}
                pageSize={getStoryListPageSize(themeSettings.layout)}
                showDate={themeSettings.show_date}
                showSubtitle={themeSettings.show_subtitle}
                storyCardVariant={themeSettings.story_card_variant}
            />
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
