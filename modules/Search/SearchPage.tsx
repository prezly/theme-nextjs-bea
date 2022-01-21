import algoliasearch from 'algoliasearch';
import { useRouter } from 'next/router';
import { FunctionComponent, useMemo, useRef, useState } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import { useAlgoliaSettings } from '@/hooks/useAlgoliaSettings';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';

import Layout from '../Layout';

import AlgoliaStateContextProvider from './components/AlgoliaStateContext';
import Results from './components/Results';
import Sidebar from './components/Sidebar';
import Title from './components/Title';
import { createUrl, queryToSearchState, SearchState, searchStateToQuery } from './utils';

import styles from './SearchPage.module.scss';

const DEBOUNCE_TIME_MS = 300;

const SearchPage: FunctionComponent = () => {
    const currentLocale = useCurrentLocale();

    const { query, push } = useRouter();
    const [searchState, setSearchState] = useState<SearchState>(queryToSearchState(query));
    const debouncedSetStateRef = useRef<number>();

    const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = useAlgoliaSettings();

    const searchClient = useMemo(
        () => algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY),
        [ALGOLIA_API_KEY, ALGOLIA_APP_ID],
    );

    const onSearchStateChange = (updatedSearchState: SearchState) => {
        if (typeof window === 'undefined') {
            return;
        }

        window.clearTimeout(debouncedSetStateRef.current);

        debouncedSetStateRef.current = window.setTimeout(() => {
            push(`/search?${searchStateToQuery(updatedSearchState)}`, undefined, {
                shallow: true,
                locale: currentLocale.toHyphenCode(),
            });
        }, DEBOUNCE_TIME_MS);

        setSearchState(updatedSearchState);
    };

    return (
        <Layout>
            <InstantSearch
                searchClient={searchClient}
                indexName={ALGOLIA_INDEX}
                searchState={searchState}
                onSearchStateChange={onSearchStateChange}
                createURL={createUrl}
            >
                <Configure
                    hitsPerPage={6}
                    filters={`attributes.culture.code:${currentLocale.toUnderscoreCode()}`}
                />
                <AlgoliaStateContextProvider>
                    <Title />
                    <div className={styles.container}>
                        <Sidebar />
                        <Results />
                    </div>
                </AlgoliaStateContextProvider>
            </InstantSearch>
        </Layout>
    );
};

export default SearchPage;
