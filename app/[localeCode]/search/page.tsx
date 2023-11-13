import { type Locale, translations } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Content, Header } from '@/modules/Layout';
import { Search } from '@/modules/Search';
import { environment, intl, routing } from '@/theme/server';
import { generateAlternateLanguageLinks } from '@/theme-kit/metadata';

interface Props {
    params: {
        localeCode: Locale.Code;
    };
}

export async function generateMetadata(): Promise<Metadata> {
    const { generateUrl } = await routing();
    const { formatMessage } = await intl();

    return {
        title: formatMessage(translations.search.title),
        alternates: {
            languages: await generateAlternateLanguageLinks((locale) =>
                generateUrl('search', { localeCode: locale.code }),
            ),
        },
    };
}

export default async function SearchPage({ params }: Props) {
    const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = environment();

    if (!ALGOLIA_APP_ID || !ALGOLIA_API_KEY || !ALGOLIA_INDEX) {
        notFound();
    }

    return (
        <>
            <Header routeName="search" />
            <Content>
                <Search
                    algoliaSettings={{
                        appId: ALGOLIA_APP_ID,
                        apiKey: ALGOLIA_API_KEY,
                        index: ALGOLIA_INDEX,
                    }}
                    localeCode={params.localeCode}
                />
            </Content>
        </>
    );
}
