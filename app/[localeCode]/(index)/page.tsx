import type { Locale } from '@prezly/theme-kit-nextjs';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { app, generatePageMetadata, routing } from '@/adapters/server';
import { Contacts } from '@/modules/Contacts';
import { FeaturedCategories } from '@/modules/FeaturedCategories';
import { Stories } from '@/modules/Stories';
import { parseBoolean, parseNumber } from 'utils';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
    searchParams: {
        category?: string;
        show_date?: string;
        show_featured_categories?: string;
        show_subtitle?: string;
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
    const { show_date, show_featured_categories, show_subtitle } = await app().themeSettings();

    const showDate = searchParams.show_date ? parseBoolean(searchParams.show_date) : show_date;
    const showFeaturedCategories = searchParams.show_featured_categories
        ? parseBoolean(searchParams.show_featured_categories)
        : show_featured_categories;
    const showSubtitle = searchParams.show_subtitle
        ? parseBoolean(searchParams.show_subtitle)
        : show_subtitle;

    return (
        <>
            <Stories
                categoryId={searchParams.category ? parseNumber(searchParams.category) : undefined}
                localeCode={params.localeCode}
                pageSize={DEFAULT_PAGE_SIZE}
                showDate={showDate}
                showSubtitle={showSubtitle}
            />
            <Contacts localeCode={params.localeCode} />
            {showFeaturedCategories && <FeaturedCategories localeCode={params.localeCode} />}
        </>
    );
}
