import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { api } from '../api';

import { generateMetadata } from './utils';

interface Params {
    localeCode: Locale.Code;
    indexable?: boolean;
}

export async function generateRootMetadata({
    localeCode,
    indexable = true,
}: Params): Promise<Metadata> {
    const { contentDelivery } = api();

    const newsroom = await contentDelivery.newsroom();

    return generateMetadata({
        localeCode,
        robots: {
            index: indexable && newsroom.is_indexable,
            follow: indexable && newsroom.is_indexable,
        },
        verification: {
            google: newsroom.google_search_console_key || undefined,
        },
    });
}
