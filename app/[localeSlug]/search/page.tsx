import { translations } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
    environment,
    generateSearchPageMetadata,
    handleLocaleSlug,
    intl,
    routing,
} from '@/adapters/server';
import { BroadcastPageType, BroadcastTranslations } from '@/modules/Broadcast';
import { Search } from '@/modules/Search';

interface Props {
    params: {
        localeSlug: string;
    };
}

async function resolve(params: Props['params']) {
    const { generateUrl } = await routing();
    const localeCode = await handleLocaleSlug(params.localeSlug, (locale) =>
        generateUrl('search', { localeCode: locale }),
    );
    return { localeCode };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { localeCode } = await resolve(params);
    const { formatMessage } = await intl(localeCode);

    return generateSearchPageMetadata({
        locale: localeCode,
        title: formatMessage(translations.search.title),
    });
}

export default async function SearchPage({ params }: Props) {
    const { localeCode } = await resolve(params);
    const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = environment();

    if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY || !ALGOLIA_INDEX) {
        notFound();
    }

    return (
        <>
            <BroadcastTranslations routeName="search" />
            <BroadcastPageType pageType="search" />
            <Search
                algoliaSettings={{
                    appId: ALGOLIA_APP_ID,
                    apiKey: ALGOLIA_API_KEY,
                    index: ALGOLIA_INDEX,
                }}
                localeCode={localeCode}
            />
        </>
    );
}
