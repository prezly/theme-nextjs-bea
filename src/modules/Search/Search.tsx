'use client';

import type { Locale } from '@prezly/theme-kit-nextjs';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';

import type { ThemeSettings } from '@/theme-settings';
import type { SearchSettings } from '@/types';
import { getSearchClient, type PublicNewsroom } from '@/utils';

import { Results } from './components/Results';
import { SearchBar } from './components/SearchBar';
import SearchStateContextProvider from './components/SearchStateContext';
import { Subtitle } from './components/Subtitle';
import { Title } from './components/Title';
import type { SearchState } from './types';
import { createUrl, queryToSearchState } from './utils';

// const DEBOUNCE_TIME_MS = 300;

interface Props {
    localeCode: Locale.Code;
    newsrooms: PublicNewsroom[];
    newsroomUuid: string;
    settings: SearchSettings;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
}

export function Search({
    localeCode,
    newsrooms,
    newsroomUuid,
    settings,
    showDate,
    showSubtitle,
    storyCardVariant,
}: Props) {
    const query = useSearchParams();
    // const { replace } = useRouter();
    const [searchState, setSearchState] = useState<SearchState>(queryToSearchState(query));

    const searchClient = useMemo(() => getSearchClient(settings), [settings]);

    const filters = `attributes.culture.code=${localeCode}`;

    // const scheduleUrlUpdate = useDebouncedCallback(
    //     (updatedSearchState: SearchState) => {
    //         replace(`?${searchStateToQuery(updatedSearchState)}`);
    //     },
    //     [replace, DEBOUNCE_TIME_MS],
    //     DEBOUNCE_TIME_MS,
    // );

    function onSearchStateChange(updatedSearchState: SearchState) {
        setSearchState(updatedSearchState);
        // scheduleUrlUpdate(updatedSearchState);
    }

    return (
        <InstantSearch
            searchClient={searchClient}
            indexName={settings.index}
            searchState={searchState}
            onSearchStateChange={onSearchStateChange}
            createURL={createUrl}
        >
            <Configure
                hitsPerPage={6}
                filters={filters}
                attributesToHighlight={[
                    'attributes.title',
                    'attributes.subtitle',
                    'attributes.section_title',
                    'attributes.section_subtitle',
                    'attributes.content_text',
                ]}
                attributesToSnippet={['attributes.content_text:30']}
                snippetEllipsisText="…"
            />
            <SearchStateContextProvider>
                <Title />
                <SearchBar />
                <Subtitle />
                <Results
                    newsrooms={newsrooms}
                    newsroomUuid={newsroomUuid}
                    showDate={showDate}
                    showSubtitle={showSubtitle}
                    storyCardVariant={storyCardVariant}
                />
            </SearchStateContextProvider>
        </InstantSearch>
    );
}
