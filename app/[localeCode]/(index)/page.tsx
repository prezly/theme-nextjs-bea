import type { Locale } from '@prezly/theme-kit-nextjs';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { app, generatePageMetadata, routing } from '@/adapters/server';
import { Contacts } from '@/modules/Contacts';
import { FeaturedCategories } from '@/modules/FeaturedCategories';
import { Stories } from '@/modules/Stories';
import { parseNumber, parsePreviewSearchParams } from 'utils';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
    searchParams: {
        category?: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default async function StoriesIndexPage({ params, searchParams }: Props) {
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    return (
        <>
            <Stories
                categoryId={searchParams.category ? parseNumber(searchParams.category) : undefined}
                localeCode={params.localeCode}
                pageSize={DEFAULT_PAGE_SIZE}
                showDate={themeSettings.show_date}
                showSubtitle={themeSettings.show_subtitle}
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
