import type { Locale } from '@prezly/theme-kit-nextjs';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { generatePageMetadata, routing } from '@/adapters/server';
import { Stories } from '@/modules/Stories';

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
    return (
        <Stories
            categoryId={searchParams.category ? parseInt(searchParams.category, 10) : undefined}
            localeCode={params.localeCode}
            pageSize={DEFAULT_PAGE_SIZE}
        />
    );
}
