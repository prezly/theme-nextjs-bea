import { type Locale, translations } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { environment, generatePageMetadata, intl, routing } from '@/adapters/server';
import { BroadcastTranslations } from '@/modules/Broadcast';
import { Search } from '@/modules/Search';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export async function generateMetadata(): Promise<Metadata> {
    const { generateUrl } = await routing();
    const { formatMessage } = await intl();

    return generatePageMetadata({
        title: formatMessage(translations.search.title),
        generateUrl: (localeCode) => generateUrl('search', { localeCode }),
    });
}

export default async function SearchPage({ params }: Props) {
    const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = environment();

    if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY || !ALGOLIA_INDEX) {
        notFound();
    }

    return (
        <>
            <BroadcastTranslations routeName="search" />
            <Search
                algoliaSettings={{
                    appId: ALGOLIA_APP_ID,
                    apiKey: ALGOLIA_API_KEY,
                    index: ALGOLIA_INDEX,
                }}
                localeCode={params.localeCode}
            />
        </>
    );
}
