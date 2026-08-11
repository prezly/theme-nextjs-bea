import { DEFAULT_PAGE_SIZE, type Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { app, generatePageMetadata, routing } from '@/adapters/server';
import { Contacts } from '@/modules/Contacts';
import { FeaturedCategories } from '@/modules/FeaturedCategories';
import { JsonLd } from '@/modules/Head';
import type { NewsroomWithHubLayout } from '@/types';
import {
    buildWebsiteSchema,
    getStoryListPageSize,
    parseId,
    parsePreviewSearchParams,
} from '@/utils';

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
    const [newsroomRaw, defaultLocale, companyInformation, settings] = await Promise.all([
        app().newsroom(),
        app().defaultLocale(),
        app().companyInformation(params.localeCode),
        app().themeSettings(),
    ]);
    const newsroom = newsroomRaw as NewsroomWithHubLayout;
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    // In market_dropdown mode the hub root behaves like a single site:
    // logo tile grid and aggregated member stories are replaced by the
    // regular single-newsroom Stories module. Peer sites remain reachable
    // via the MarketsPanel in the header.
    const isHubWithTiles = newsroom.is_hub && newsroom.hub_layout !== 'market_dropdown';

    // Google only treats the domain/subdomain root as the site homepage for
    // site-name WebSite structured data — not locale-prefixed paths like /fr.
    const isSiteHomepage = params.localeCode === defaultLocale;

    return (
        <>
            {isSiteHomepage && (
                <JsonLd schema={buildWebsiteSchema({ newsroom, companyInformation })} />
            )}
            {isHubWithTiles ? (
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
