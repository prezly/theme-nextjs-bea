import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { generatePageMetadata, routing } from '@/adapters/server';
import { Stories } from '@/modules/Stories';

import { resolve } from './resolve';

interface Props {
    params: {
        localeSlug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { generateAbsoluteUrl } = await routing();

    const { localeCode } = await resolve(params);

    return generatePageMetadata(
        {
            locale: localeCode,
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

export default async function StoriesIndexPage({ params }: Props) {
    const { localeCode } = await resolve(params);

    return <Stories localeCode={localeCode} pageSize={DEFAULT_PAGE_SIZE} />;
}
