// import type { SearchResponse } from '@algolia/client-search';
// import algoliasearch from 'algoliasearch';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { NewsroomContextProvider } from '@/contexts/newsroom';
import { importMessages } from '@/utils/lang';
import { getRedirectToCanonicalLocale } from '@/utils/locale';
import { getPrezlyApi } from '@/utils/prezly';
import { BasePageProps, Translations } from 'types';

const SearchPage = dynamic(() => import('@/modules/Search'), { ssr: true });

interface Props extends BasePageProps {
    translations: Translations;
    // initialResults: SearchResponse<AlgoliaStory> | null;
}

const SearchResultsPage: FunctionComponent<Props> = ({
    categories,
    newsroom,
    companyInformation,
    languages,
    localeCode,
    translations,
    themePreset,
    algoliaSettings,
}) => (
    <NewsroomContextProvider
        categories={categories}
        newsroom={newsroom}
        companyInformation={companyInformation}
        languages={languages}
        localeCode={localeCode}
        translations={translations}
        themePreset={themePreset}
        algoliaSettings={algoliaSettings}
    >
        <SearchPage />
    </NewsroomContextProvider>
);

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { req: request, locale, query } = context;
    const api = getPrezlyApi(request);

    const basePageProps = await api.getBasePageProps(request, locale);
    const { localeResolved } = basePageProps;

    if (!localeResolved) {
        return { notFound: true };
    }

    const redirect = getRedirectToCanonicalLocale(basePageProps, locale, '/search', query);
    if (redirect) {
        return { redirect };
    }

    const translations = await importMessages(basePageProps.localeCode);

    // TODO: The SSR solutions propopsed by Algolia don't seem to work and are poorly typed
    // This is the only piece of code that actually works, although it's not clear how to transform them into `resultsState` structure
    // See https://www.algolia.com/doc/guides/building-search-ui/going-further/server-side-rendering/react/
    // See https://www.algolia.com/doc/guides/building-search-ui/going-further/backend-search/in-depth/backend-instantsearch/react/

    // const searchQuery = query.query && typeof query.query === 'string' ? query.query : '';
    // let initialResults: SearchResponse<AlgoliaStory> | null = null;
    // try {
    //     const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = basePageProps.algoliaSettings;
    //     const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
    //     const searchResults = await searchClient.search<AlgoliaStory>([
    //         {
    //             type: 'default',
    //             indexName: ALGOLIA_INDEX,
    //             query: searchQuery,
    //             params: {
    //                 hitsPerPage: 6,
    //                 restrictSearchableAttributes: ['attributes.title'],
    //                 filters: `attributes.culture.code:${basePageProps.localeCode}`,
    //             },
    //         },
    //     ]);
    //     [initialResults] = searchResults.results;
    // } catch (error) {
    //     // eslint-disable-next-line no-console
    //     console.error('Error when hitting Algolia API', error);
    // }

    return {
        props: {
            ...basePageProps,
            translations,
            // initialResults,
        },
    };
};

export default SearchResultsPage;
