import algoliasearch from 'algoliasearch';
import { useRouter } from 'next/router';
// import type { ParsedUrlQuery } from 'querystring';
import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import { useAlgoliaSettings } from '@/hooks/useAlgoliaSettings';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
// import { LocaleObject } from '@/utils/localeObject';
import type { PaginationProps, StoryWithImage } from 'types';

import Layout from '../Layout';

import MainPanel from './components/MainPanel';
import Sidebar from './components/Sidebar';
import Title from './components/Title';

import styles from './SearchPage.module.scss';

interface Props {
    stories: StoryWithImage[];
    pagination: PaginationProps;
}

interface SearchState extends Record<string, any> {
    query: string;
    page: number;
    configure: any;
}

// function queryToSearchState(urlQuery: ParsedUrlQuery, currentLocale: LocaleObject): SearchState {
//     const { query } = urlQuery;

//     return {
//         query: typeof query === 'string' ? query : '',
//         page: 1,
//         configure: {
//             hitsPerPage: 6,
//             restrictSearchableAttributes: ['attributes.title'],
//             filters: `attributes.culture.code:${currentLocale.toUnderscoreCode()}`,
//         },
//     };
// }

// function searchStateToQuery(state: SearchState): string {
//     const { configure, page, ...rest } = state;

//     return new URLSearchParams(rest).toString();
// }

// const DEBOUNCE_TIME_MS = 500;

const SearchPage: FunctionComponent<Props> = ({ stories, pagination }) => {
    const currentLocale = useCurrentLocale();

    const { query, push } = useRouter();
    // const [searchState, setSearchState] = useState<SearchState>(
    //     queryToSearchState(query, currentLocale),
    // );
    // const debouncedSetStateRef = useRef<number>();

    const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = useAlgoliaSettings();

    const searchClient = useMemo(
        () => algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY),
        [ALGOLIA_API_KEY, ALGOLIA_APP_ID],
    );

    // const onSearchStateChange = (updatedSearchState: SearchState) => {
    //     if (typeof window === 'undefined') {
    //         return;
    //     }
    //     console.log(updatedSearchState);
    //     window.clearTimeout(debouncedSetStateRef.current);

    //     debouncedSetStateRef.current = window.setTimeout(() => {
    //         push(`/search?${searchStateToQuery(updatedSearchState)}`, undefined, {
    //             shallow: true,
    //             locale: currentLocale.toHyphenCode(),
    //         });
    //     }, DEBOUNCE_TIME_MS);

    //     setSearchState(updatedSearchState);
    // };

    // useEffect(() => {
    //     setSearchState(queryToSearchState(query, currentLocale));
    // }, [query, currentLocale]);

    return (
        <Layout>
            <InstantSearch
                searchClient={searchClient}
                indexName={ALGOLIA_INDEX}
                // searchState={searchState}
                // onSearchStateChange={onSearchStateChange}
            >
                <Configure
                    hitsPerPage={6}
                    restrictSearchableAttributes={['attributes.title']}
                    filters={`attributes.culture.code:${currentLocale.toUnderscoreCode()}`}
                />
                <Title initialResultsCount={stories.length} />
                <div className={styles.container}>
                    <Sidebar />
                    <MainPanel initialStories={stories} pagination={pagination} />
                </div>
            </InstantSearch>
        </Layout>
    );
};

export default SearchPage;
